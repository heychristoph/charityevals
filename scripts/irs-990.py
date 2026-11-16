#!/usr/bin/env python3
"""US Form 990 e-file XML from the IRS TEOS bulk data, reading only the bytes needed (no ProPublica bot check).

Usage:
  python3 scripts/irs-990.py [fetch] EIN [--year TAXYEAR] [--out PATH] [--summary]
      One organisation's filing: finds it in the yearly indexes and reads it out of the bulk zip.
      EIN       with or without the dash (45-5620445)
      --year    tax year (the TAX_PERIOD year: 2024 = fiscal year ending in 2024). Default: the latest found.
      --out     output XML path (default: <ein>_<taxperiod>.xml in a new folder under $TMPDIR/charityevals-irs-990-out)
      --summary also print key Part I / Part IX figures (990 and 990EZ; 990PF XML is saved only)
  python3 scripts/irs-990.py extract ZIP_URL NAME [--out PATH]
      Range-read one entry of any remote zip (an IRS bulk zip is 0.1-2 GB) without downloading it whole:
      NAME is the entry's file name, or an OBJECT_ID (then <OBJECT_ID>_public.xml), folder prefix optional.
  python3 scripts/irs-990.py list ZIP_URL [--grep TEXT]
      The entries of a remote zip (name, method, compressed and full size), from its central directory.
  python3 scripts/irs-990.py --self-test
      Offline checks of the zip reader (stored, deflate, zip64, folder prefixes) against local zips.

How it works (standard library + curl, and the system `unzip` only for Deflate64 entries; needs network):
  1. Streams https://apps.irs.gov/pub/epostcard/990/xml/<Y>/index_<Y>.csv (Y = submission year; tax year T
     is usually filed in T+1, sometimes T or T+2) and keeps the EIN's rows. The return read is the 990
     (else the 990-EZ, else the 990-PF; a 990-T or other return only if there is nothing else), of the
     latest tax period, the highest OBJECT_ID (an amendment) winning; the EIN's other returns are listed.
  2. The bulk zips of year Y: the ones the IRS downloads page lists (cached a day), else the usual names.
     2023 on: <Y>_TEOS_XML_<MM><L>.zip, monthly; the index's XML_BATCH_ID is tried first, then its
     neighbouring letters, then the months nearest the submission date. 2021-22: <Y>_TEOS_XML_01A.zip.
     2019-20 (no batch id in the index): download990xml_<Y>_1..8.zip and <Y>_TEOS_XML_CT1.zip, all tried.
  3. Each zip's end record and central directory are range-read (cached in $TMPDIR, so later EINs in the
     same zip cost one request); the entry's bytes are read alone. Stored and deflate entries are
     decompressed here; Deflate64 (method 9, which Python's zipfile can't read) goes through `unzip`.
Never put downloaded files in a directory you run code from; the default output is a plain .xml.
"""
import argparse, csv, datetime, hashlib, os, re, struct, subprocess, sys, tempfile, time, zlib

BASE = "https://apps.irs.gov/pub/epostcard/990/xml"
PAGE = "https://www.irs.gov/charities-non-profits/form-990-series-downloads"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"
CACHE = os.path.join(tempfile.gettempdir(), "charityevals-irs-990")


def curl(url, rng=None, head=False, stream=False):
    cmd = ["curl", "-sSL", "--fail", "--retry", "3", "-A", UA]
    if head:
        cmd.append("-I")
    if rng:
        cmd += ["-r", rng]
    cmd.append(url)
    if stream:
        return subprocess.Popen(cmd, stdout=subprocess.PIPE)
    return subprocess.run(cmd, capture_output=True, check=True).stdout


def cached(key, make, max_age=None):
    os.makedirs(CACHE, exist_ok=True)
    p = os.path.join(CACHE, hashlib.sha1(key.encode()).hexdigest())
    if os.path.exists(p) and (max_age is None or time.time() - os.path.getmtime(p) < max_age):
        with open(p, "rb") as f:
            return f.read()
    data = make()
    with open(p + ".tmp", "wb") as f:
        f.write(data)
    os.replace(p + ".tmp", p)
    return data


# --- Remote zip reading --------------------------------------------------------------------------------

def remote_size(url):
    if url.startswith("file://"):
        return os.path.getsize(url[7:])
    h = curl(url, head=True).decode("latin1")
    m = re.findall(r"content-length:\s*(\d+)", h, re.I)
    if not m:
        raise RuntimeError(f"no size for {url}")
    return int(m[-1])


def read_range(url, start, end):
    """Bytes start..end inclusive."""
    if url.startswith("file://"):
        with open(url[7:], "rb") as f:
            f.seek(start)
            return f.read(end - start + 1)
    return curl(url, rng=f"{start}-{end}")


def central_directory(url):
    """The zip's central directory entries: dicts with name, method, csize, usize, offset, raw."""
    size = remote_size(url)

    def fetch():
        tail_len = min(size, 70000)
        tail = read_range(url, size - tail_len, size - 1)
        i = tail.rfind(b"PK\x05\x06")
        if i < 0:
            raise RuntimeError(f"{url}: no end-of-central-directory record (not a zip?)")
        cd_size, cd_off = struct.unpack("<II", tail[i + 12:i + 20])
        if cd_off == 0xFFFFFFFF or cd_size == 0xFFFFFFFF:  # zip64
            j = tail.rfind(b"PK\x06\x06")
            cd_size, cd_off = struct.unpack("<QQ", tail[j + 40:j + 56])
        return read_range(url, cd_off, cd_off + cd_size - 1)

    cd = fetch() if url.startswith("file://") else cached(f"cd:{url}:{size}", fetch)
    out, pos = [], 0
    while pos + 46 <= len(cd) and cd[pos:pos + 4] == b"PK\x01\x02":
        method = struct.unpack("<H", cd[pos + 10:pos + 12])[0]
        csize, usize = struct.unpack("<II", cd[pos + 20:pos + 28])
        nl, el, cl = struct.unpack("<HHH", cd[pos + 28:pos + 34])
        loff = struct.unpack("<I", cd[pos + 42:pos + 46])[0]
        name = cd[pos + 46:pos + 46 + nl]
        extra = cd[pos + 46 + nl:pos + 46 + nl + el]
        end = pos + 46 + nl + el + cl
        if 0xFFFFFFFF in (csize, loff, usize):  # zip64 extra field: the 8-byte values, in this order
            k, vals = 0, []
            while k + 4 <= len(extra):
                hid, dl = struct.unpack("<HH", extra[k:k + 4])
                if hid == 1:
                    vals = list(struct.unpack("<%dQ" % (dl // 8), extra[k + 4:k + 4 + dl - dl % 8]))
                    break
                k += 4 + dl
            if usize == 0xFFFFFFFF: usize = vals.pop(0)
            if csize == 0xFFFFFFFF: csize = vals.pop(0)
            if loff == 0xFFFFFFFF: loff = vals.pop(0)
        out.append({"name": name.decode("utf-8", "replace"), "method": method, "csize": csize, "usize": usize, "offset": loff, "raw": cd[pos:end]})
        pos = end
    return out


def find(entries, name):
    """The entry called name, with or without a folder prefix (older batches keep one)."""
    for e in entries:
        if e["name"] == name or e["name"].endswith("/" + name):
            return e
    return None


def read_entry(url, e):
    """The entry's uncompressed bytes, reading only its local header and data."""
    lh = read_range(url, e["offset"], e["offset"] + 29)
    if lh[:4] != b"PK\x03\x04":
        raise RuntimeError(f"{url}: no local header at {e['offset']}")
    nl, el = struct.unpack("<HH", lh[26:30])
    start = e["offset"] + 30 + nl + el
    data = read_range(url, start, start + e["csize"] - 1) if e["csize"] else b""
    if e["method"] == 0:
        return data
    if e["method"] == 8:
        return zlib.decompressobj(-15).decompress(data)
    if e["method"] == 9:
        return deflate64(read_range(url, e["offset"], start - 1) + data, e)
    raise RuntimeError(f"{e['name']}: compression method {e['method']} not supported")


def deflate64(local, e):
    """Deflate64 through the system unzip: the entry rewrapped as a one-entry zip (offset 0)."""
    cd = bytearray(e["raw"][:46 + struct.unpack("<H", e["raw"][28:30])[0]])
    struct.pack_into("<HHH", cd, 30, 0, 0, 0)  # no extra field or comment
    struct.pack_into("<I", cd, 20, min(e["csize"], 0xFFFFFFFE))
    struct.pack_into("<I", cd, 24, min(e["usize"], 0xFFFFFFFE))
    struct.pack_into("<I", cd, 42, 0)
    eocd = b"PK\x05\x06" + struct.pack("<HHHHIIH", 0, 0, 1, 1, len(cd), len(local), 0)
    with tempfile.TemporaryDirectory() as d:
        zp = os.path.join(d, "one.zip")
        with open(zp, "wb") as f:
            f.write(local + bytes(cd) + eocd)
        r = subprocess.run(["unzip", "-p", zp], capture_output=True)
        if not r.stdout:
            raise RuntimeError("Deflate64 entry and `unzip` couldn't read it: " + r.stderr.decode()[:300])
        return r.stdout


def extract(url, name, out):
    """Write the entry called name in the remote zip to out; False if the zip has no such entry."""
    e = find(central_directory(url), name)
    if not e:
        return False
    data = read_entry(url, e)
    with open(out, "wb") as f:
        f.write(data)
    return True


# --- Finding the filing --------------------------------------------------------------------------------

def index_rows(year, ein):
    p = curl(f"{BASE}/{year}/index_{year}.csv", stream=True)
    rows, header = [], None
    needle = f",{ein},".encode()
    for line in p.stdout:
        if header is None:
            header = next(csv.reader([line.decode("utf-8", "replace")]))
            continue
        if needle in line:
            r = dict(zip(header, next(csv.reader([line.decode("utf-8", "replace")]))))
            if r.get("EIN", "").lstrip("0") == ein.lstrip("0"):
                rows.append(r)
    p.wait()
    if header is None:
        return None  # index missing (year not published yet)
    return rows


def listed_zips(year):
    """The bulk zips the IRS downloads page lists for submission year `year` (empty if the page fails)."""
    try:
        html = cached(f"page:{PAGE}", lambda: curl(PAGE), max_age=86400).decode("utf-8", "replace")
    except subprocess.CalledProcessError:
        return []
    names = re.findall(rf"/990/xml/{year}/([A-Za-z0-9_]+)\.zip", html)
    return list(dict.fromkeys(names))


def neighbours(batch):
    m = re.match(r"(.*_)(\d+)([A-Z])$", batch)
    if not m:
        return [batch]
    pre, num, L = m.groups()
    out = [batch]
    for dl in (1, -1, 2, -2, 3):
        c = ord(L) + dl
        if 65 <= c <= 90:
            out.append(f"{pre}{num}{chr(c)}")
    return out


def candidate_batches(row, year):
    """The bulk zips to try for an index row, most likely first."""
    listed = listed_zips(year)
    first = neighbours(row["XML_BATCH_ID"]) if row.get("XML_BATCH_ID") else []
    m = re.match(r"(\d+)/", row.get("SUB_DATE", ""))
    month = int(m.group(1)) if m and 1 <= int(m.group(1)) <= 12 else 6

    def rank(b):
        mm = re.match(rf"{year}_TEOS_XML_(\d\d)([A-Z])$", b)
        if mm:  # monthly batches: nearest the submission month, then later months (processing lags)
            d = int(mm.group(1)) - month
            return (0, abs(d) + (0.5 if d < 0 else 0), mm.group(2))
        mm = re.match(rf"download990xml_{year}_(\d+)$", b)
        return (1, int(mm.group(1)) if mm else 99, b)

    guessed = [f"{year}_TEOS_XML_{m:02d}{L}" for m in range(1, 13) for L in "ABCD"] if year >= 2021 else \
        [f"download990xml_{year}_{i}" for i in range(1, 9)] + [f"{year}_TEOS_XML_CT1"]
    rest = sorted(listed or guessed, key=rank)
    return list(dict.fromkeys(first + rest)), bool(listed)


def val(xml, *tags):
    for t in tags:
        m = re.search(rf"<(?:\w+:)?{t}>([^<]*)</", xml)
        if m:
            return m.group(1)
    return None


def summary(xml, row):
    print(f"{row['TAXPAYER_NAME']}  EIN {row['EIN']}  period {row['TAX_PERIOD']}  form {row['RETURN_TYPE']}")
    items = [
        ("Total revenue", ("CYTotalRevenueAmt", "TotalRevenueGrp/TotalRevenueColumnAmt", "TotalRevenue")),
        ("Contributions and grants", ("CYContributionsGrantsAmt", "ContributionsGiftsGrantsEtcAmt")),
        ("Total expenses", ("CYTotalExpensesAmt", "TotalExpensesGrp/TotalAmt", "TotalExpenses")),
        ("Program service expenses", ("TotalProgramServiceExpensesAmt", "TotalProgramServiceExpense")),
        ("Employees", ("TotalEmployeeCnt", "EmployeeCnt")),
        ("Volunteers", ("TotalVolunteersCnt",)),
    ]
    for label, tags in items:
        v = None
        for t in tags:
            if "/" in t:
                g, c = t.split("/")
                m = re.search(rf"<{g}>.*?<{c}>([^<]*)</", xml, re.S)
                v = m.group(1) if m else None
            else:
                v = val(xml, t)
            if v:
                break
        print(f"  {label}: {v if v is not None else 'n/a'}")
    # Part IX line 25 column B (programme) / total, for cross-checking
    m = re.search(r"<TotalFunctionalExpensesGrp>(.*?)</TotalFunctionalExpensesGrp>", xml, re.S)
    if m:
        g = m.group(1)
        print("  Part IX total / program / management / fundraising:",
              *[val(g, t) for t in ("TotalAmt", "ProgramServicesAmt", "ManagementAndGeneralAmt", "FundraisingAmt")])


# Which return to read when an EIN filed several for the year: the full 990 first (a 990-T, the
# unrelated-business income return, has none of the figures).
FORM_RANK = {"990": 3, "990EZ": 2, "990PF": 1}


def fetch(a):
    ein = a.ein.replace("-", "").strip()
    now = datetime.date.today().year
    years = [a.year + 1, a.year, a.year + 2] if a.year else [now, now - 1, now - 2]
    cands = []
    for y in years:
        rows = index_rows(y, ein)
        if rows is None:
            continue
        for r in rows:
            r["_Y"] = y
            if a.year is None or r["TAX_PERIOD"][:4] == str(a.year):
                cands.append(r)
        if cands:
            break
    if not cands:
        sys.exit(f"No filing found for EIN {ein}" + (f" tax year {a.year}" if a.year else "") + f" in the indexes of {years}")
    cands.sort(key=lambda r: (FORM_RANK.get(r.get("RETURN_TYPE", "").upper().replace("-", ""), 0), r["TAX_PERIOD"], r["OBJECT_ID"]))
    row = cands[-1]
    for r in cands[:-1]:
        print(f"also filed: {r.get('RETURN_TYPE', '?')} period {r['TAX_PERIOD']} (object {r['OBJECT_ID']}); read it with `extract`", file=sys.stderr)
    name = f"{row['OBJECT_ID']}_public.xml"
    if a.out:
        out = a.out
    else:
        base = os.path.join(tempfile.gettempdir(), "charityevals-irs-990-out")
        os.makedirs(base, exist_ok=True)
        out = os.path.join(tempfile.mkdtemp(dir=base), f"{ein}_{row['TAX_PERIOD']}.xml")
    batches, from_page = candidate_batches(row, row["_Y"])
    tried = 0
    for b in batches:
        url = f"{BASE}/{row['_Y']}/{b}.zip"
        try:
            tried += 1
            ok = extract(url, name, out)
        except subprocess.CalledProcessError:
            continue  # no such zip
        if ok:
            print(f"{row['TAXPAYER_NAME']}: {name} in {b}.zip (index {row['_Y']}, batch {row.get('XML_BATCH_ID') or 'not listed'}); wrote {out}", file=sys.stderr)
            break
    else:
        sys.exit(f"{name} not found in the {tried} bulk zips of {row['_Y']} tried ({'from the IRS page' if from_page else 'guessed names'})")
    if a.summary:
        summary(open(out, encoding="utf-8", errors="replace").read(), row)


# --- Self-test -----------------------------------------------------------------------------------------

def self_test():
    import zipfile
    with tempfile.TemporaryDirectory() as d:
        body = (b"<Return><TotalAmt>12345</TotalAmt></Return>\n" * 2000)
        zp = os.path.join(d, "t.zip")
        with zipfile.ZipFile(zp, "w") as z:
            z.writestr(zipfile.ZipInfo("2020_TEOS/201912345_public.xml"), body, compress_type=zipfile.ZIP_DEFLATED)
            z.writestr("stored.xml", b"plain", compress_type=zipfile.ZIP_STORED)
            with z.open("big.bin", "w", force_zip64=True) as f:
                f.write(b"x" * 1000)
        url = "file://" + zp
        ents = central_directory(url)
        assert [e["name"] for e in ents] == ["2020_TEOS/201912345_public.xml", "stored.xml", "big.bin"], ents
        assert read_entry(url, find(ents, "201912345_public.xml")) == body, "deflate entry with a folder prefix"
        assert read_entry(url, find(ents, "stored.xml")) == b"plain", "stored entry"
        assert read_entry(url, find(ents, "big.bin")) == b"x" * 1000, "zip64 entry"
        assert find(ents, "missing.xml") is None
        out = os.path.join(d, "o.xml")
        assert extract(url, "201912345_public.xml", out) and open(out, "rb").read() == body
        row = {"XML_BATCH_ID": "2024_TEOS_XML_05A", "SUB_DATE": "5/2/2024 1:00:00 PM"}
        global listed_zips
        real, listed_zips = listed_zips, lambda y: []
        try:
            b, _ = candidate_batches(row, 2024)
            assert b[:3] == ["2024_TEOS_XML_05A", "2024_TEOS_XML_05B", "2024_TEOS_XML_05C"], b[:3]
            b, _ = candidate_batches({"SUB_DATE": "3/9/2020 1:00:00 PM"}, 2020)
            assert b[0] == "download990xml_2020_1" and "2020_TEOS_XML_CT1" in b, b
        finally:
            listed_zips = real
        if subprocess.run(["unzip", "-v"], capture_output=True).returncode == 0:
            # The Deflate64 path's wrapper, exercised on a deflate entry (unzip reads both the same way).
            e = find(ents, "201912345_public.xml")
            lh = read_range(url, e["offset"], e["offset"] + 29)
            nl, el = struct.unpack("<HH", lh[26:30])
            local = read_range(url, e["offset"], e["offset"] + 30 + nl + el + e["csize"] - 1)
            assert deflate64(local, e) == body, "one-entry rewrap through unzip"
    print("irs-990.py self-test: ok")


def main():
    argv = sys.argv[1:]
    if argv[:1] == ["--self-test"]:
        return self_test()
    if argv[:1] in (["list"], ["extract"]):
        ap = argparse.ArgumentParser(prog=f"irs-990.py {argv[0]}")
        ap.add_argument("url")
        if argv[0] == "extract":
            ap.add_argument("name")
            ap.add_argument("--out")
        else:
            ap.add_argument("--grep")
        a = ap.parse_args(argv[1:])
        if argv[0] == "list":
            for e in central_directory(a.url):
                if not a.grep or a.grep in e["name"]:
                    print(f"{e['name']}\tmethod {e['method']}\t{e['csize']}\t{e['usize']}")
            return
        name = a.name if not re.fullmatch(r"\d{10,}", a.name) else f"{a.name}_public.xml"
        out = a.out or os.path.basename(name)
        if not extract(a.url, name, out):
            sys.exit(f"{name} not in {a.url}")
        print(f"wrote {out}", file=sys.stderr)
        return
    if argv[:1] == ["fetch"]:
        argv = argv[1:]
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("ein")
    ap.add_argument("--year", type=int)
    ap.add_argument("--out")
    ap.add_argument("--summary", action="store_true")
    fetch(ap.parse_args(argv))


if __name__ == "__main__":
    main()
