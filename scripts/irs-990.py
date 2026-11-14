#!/usr/bin/env python3
"""Fetch one US Form 990 e-file XML from the IRS TEOS bulk data (no ProPublica bot check).

Usage:
  python3 scripts/irs-990.py EIN [--year TAXYEAR] [--out PATH] [--summary]

  EIN         with or without the dash (45-5620445)
  --year      tax year of the filing (the TAX_PERIOD year, e.g. 2024 = fiscal year ending in 2024).
              Default: the latest filing found in the newest indexes.
  --out       output XML path (default: ./<ein>_<taxperiod>.xml)
  --summary   also print key Part I / Part IX figures (990 and 990EZ; 990PF XML is saved only)

How it works (standard library + curl + the system `unzip`; needs network):
  1. Streams https://apps.irs.gov/pub/epostcard/990/xml/<Y>/index_<Y>.csv (Y = submission year;
     tax year T is usually filed in T+1, sometimes T or T+2) and keeps rows for the EIN.
     Amended returns: the row with the highest OBJECT_ID wins per tax period.
  2. Batch zip = .../xml/<Y>/<XML_BATCH_ID>.zip. The index's batch id can be off by one letter
     (e.g. 01A listed, file is 01B), so neighbouring letters are tried.
  3. Range-reads the zip's end and central directory over HTTP, finds <OBJECT_ID>_public.xml,
     downloads only that entry's bytes, wraps them as a one-entry zip and extracts with `unzip`
     (handles Deflate64, which Python's zipfile cannot).
Never put downloaded files in a directory you run code from; the default output is a plain .xml.
"""
import argparse, csv, os, re, struct, subprocess, sys, tempfile, datetime

BASE = "https://apps.irs.gov/pub/epostcard/990/xml"


def curl(url, rng=None, head=False, stream=False):
    cmd = ["curl", "-sSL", "--fail", "--retry", "3", "-A", "Mozilla/5.0"]
    if head:
        cmd.append("-I")
    if rng:
        cmd += ["-r", rng]
    cmd.append(url)
    if stream:
        return subprocess.Popen(cmd, stdout=subprocess.PIPE)
    return subprocess.run(cmd, capture_output=True, check=True).stdout


def index_rows(year, ein):
    url = f"{BASE}/{year}/index_{year}.csv"
    p = curl(url, stream=True)
    rows, header = [], None
    needle = f",{ein},".encode()
    for line in p.stdout:
        if header is None:
            header = next(csv.reader([line.decode()]))
            continue
        if needle in line:
            r = dict(zip(header, next(csv.reader([line.decode("utf-8", "replace")]))))
            if r.get("EIN", "").lstrip("0") == ein.lstrip("0"):
                rows.append(r)
    p.wait()
    if p.returncode not in (0, None) and header is None:
        return None  # index missing (year not published yet)
    return rows


def zip_size(url):
    h = curl(url, head=True).decode("latin1")
    m = re.findall(r"content-length:\s*(\d+)", h, re.I)
    return int(m[-1])


def find_entry(url, name):
    """Return (local_offset, comp_size, central_dir_entry_bytes) for name in the remote zip."""
    size = zip_size(url)
    tail_len = min(size, 70000)
    tail = curl(url, rng=f"{size - tail_len}-{size - 1}")
    i = tail.rfind(b"PK\x05\x06")
    cd_size, cd_off = struct.unpack("<II", tail[i + 12:i + 20])
    if cd_off == 0xFFFFFFFF or cd_size == 0xFFFFFFFF:  # zip64
        j = tail.rfind(b"PK\x06\x06")
        cd_size, cd_off = struct.unpack("<QQ", tail[j + 40:j + 56])
    cd = curl(url, rng=f"{cd_off}-{cd_off + cd_size - 1}")
    target = name.encode()
    pos = 0
    while pos + 46 <= len(cd) and cd[pos:pos + 4] == b"PK\x01\x02":
        csize, usize = struct.unpack("<II", cd[pos + 20:pos + 28])
        nl, el, cl = struct.unpack("<HHH", cd[pos + 28:pos + 34])
        loff = struct.unpack("<I", cd[pos + 42:pos + 46])[0]
        fname = cd[pos + 46:pos + 46 + nl]
        end = pos + 46 + nl + el + cl
        if fname == target:
            extra = cd[pos + 46 + nl:pos + 46 + nl + el]
            if 0xFFFFFFFF in (csize, loff, usize):  # zip64 extra field
                k, vals = 0, []
                while k + 4 <= len(extra):
                    hid, dl = struct.unpack("<HH", extra[k:k + 4])
                    if hid == 1:
                        vals = list(struct.unpack("<%dQ" % (dl // 8), extra[k + 4:k + 4 + dl]))
                        break
                    k += 4 + dl
                if usize == 0xFFFFFFFF: vals.pop(0)
                if csize == 0xFFFFFFFF: csize = vals.pop(0)
                if loff == 0xFFFFFFFF: loff = vals.pop(0)
            return loff, csize, cd[pos:end]
        pos = end
    return None


def extract(url, name, out):
    hit = find_entry(url, name)
    if not hit:
        return False
    loff, csize, cdent = hit
    lh = curl(url, rng=f"{loff}-{loff + 29}")
    nl, el = struct.unpack("<HH", lh[26:30])
    blob = curl(url, rng=f"{loff}-{loff + 30 + nl + el + csize - 1}")
    # central entry rewritten: local offset 0, no zip64 extra needed (sizes copied from header)
    cd = bytearray(cdent)
    nlc, elc, clc = struct.unpack("<HHH", cd[28:34])
    cd = bytearray(cd[:46 + nlc]) + b""  # drop extra/comment
    struct.pack_into("<H", cd, 30, 0)
    struct.pack_into("<H", cd, 32, 0)
    struct.pack_into("<I", cd, 20, csize)
    struct.pack_into("<I", cd, 42, 0)
    eocd = b"PK\x05\x06" + struct.pack("<HHHHIIH", 0, 0, 1, 1, len(cd), len(blob), 0)
    with tempfile.TemporaryDirectory() as d:
        zp = os.path.join(d, "one.zip")
        with open(zp, "wb") as f:
            f.write(blob + bytes(cd) + eocd)
        r = subprocess.run(["unzip", "-p", zp], capture_output=True)
        if not r.stdout:
            sys.exit("unzip failed: " + r.stderr.decode()[:300])
        with open(out, "wb") as f:
            f.write(r.stdout)
    return True


def neighbours(batch):
    m = re.match(r"(.*_)(\d+)([A-Z])$", batch)
    if not m:
        return [batch]
    pre, num, L = m.groups()
    out = [batch]
    for dl in (1, -1, 2, -2):
        c = ord(L) + dl
        if 65 <= c <= 90:
            out.append(f"{pre}{num}{chr(c)}")
    return out


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


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("ein")
    ap.add_argument("--year", type=int)
    ap.add_argument("--out")
    ap.add_argument("--summary", action="store_true")
    a = ap.parse_args()
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
        if cands and a.year is None:
            break
        if cands and a.year:
            break
    if not cands:
        sys.exit(f"No filing found for EIN {ein}" + (f" tax year {a.year}" if a.year else ""))
    cands.sort(key=lambda r: (r["TAX_PERIOD"], r["OBJECT_ID"]))
    row = cands[-1]
    name = f"{row['OBJECT_ID']}_public.xml"
    out = a.out or f"{ein}_{row['TAX_PERIOD']}.xml"
    ok = False
    for b in neighbours(row["XML_BATCH_ID"]):
        url = f"{BASE}/{row['_Y']}/{b}.zip"
        try:
            ok = extract(url, name, out)
        except subprocess.CalledProcessError:
            continue
        if ok:
            print(f"batch {b} ({row['XML_BATCH_ID']} listed); wrote {out}", file=sys.stderr)
            break
    if not ok:
        sys.exit(f"{name} not found in batch {row['XML_BATCH_ID']} or neighbours")
    if a.summary:
        summary(open(out, encoding="utf-8", errors="replace").read(), row)


if __name__ == "__main__":
    main()
