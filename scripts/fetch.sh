#!/bin/sh
# Download one URL as a browser would, into a fresh folder, and say what arrived.
#   scripts/fetch.sh <url> [out]
#   out   a file path (its folder must not exist yet or be empty) or nothing: a new folder under
#         $TMPDIR/charityevals-fetch/ named by time, the file named after the URL's last part
# Prints: the saved path, its type (file(1)) and its size; the final URL after redirects, and the
# HTTP status, on stderr. Follows redirects, retries twice, gives up after 120 s. Exit 1 on an HTTP
# error (4xx/5xx), with the body kept for inspection (a bot-check page says why).
# Spaces and other characters a URL can't hold are percent-encoded (existing %XX stay). A connection
# the server breaks (HTTP/2 stream errors, an empty reply: some servers drop a browser's user agent
# from a client that isn't one) is tried again over HTTP/1.1, then with curl's own user agent.
# It only saves bytes: nothing downloaded is opened, unpacked or run, and the file is made read-only.
# Read PDFs with scripts/pdf-text.sh; never run code from the download folder.
set -eu
url="${1:-}"
[ -n "$url" ] || { sed -n '2,13p' "$0" >&2; exit 2; }
case "$url" in http://*|https://*) ;; *) echo "fetch: only http(s) URLs" >&2; exit 2 ;; esac
raw_url=$url
url=$(python3 -I -c 'import sys, urllib.parse as u; print(u.quote(sys.argv[1], safe="%:/?#[]@!$&\x27()*+,;=~-._"))' "$url")
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

name=$(printf '%s' "$raw_url" | sed -e 's/[?#].*$//' -e 's:/*$::' -e 's:.*/::' | tr -c 'A-Za-z0-9._-' '_' | cut -c1-120)
[ -n "$name" ] || name=download
if [ $# -ge 2 ]; then
  out="$2"
  dir=$(dirname "$out")
  if [ -d "$dir" ] && [ -n "$(ls -A "$dir")" ]; then echo "fetch: $dir is not empty; downloads go in a fresh folder" >&2; exit 2; fi
  mkdir -p "$dir"
else
  base="${TMPDIR:-/tmp}"; base="${base%/}/charityevals-fetch"
  mkdir -p "$base"
  dir=$(mktemp -d "$base/$(date +%Y%m%d-%H%M%S)-XXXX")
  out="$dir/$name"
fi
[ ! -e "$out" ] || { echo "fetch: $out exists" >&2; exit 2; }

# get <curl options...>: the download; sets $meta, returns curl's exit code.
get() {
  rc=0
  meta=$(curl -sS -L --max-redirs 10 --retry 2 --max-time 120 --compressed \
    -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf,*/*;q=0.8" \
    -H "Accept-Language: en-GB,en;q=0.9" \
    "$@" -o "$out" -w '%{http_code} %{url_effective} %{content_type}' "$url") || rc=$?
  return $rc
}
# curl exit codes for a connection the server broke: 16 HTTP/2 framing, 52 empty reply, 56 receive
# failure, 92 HTTP/2 stream error.
broken() { case "$1" in 16|52|56|92) return 0 ;; *) return 1 ;; esac; }
rc=0; get -A "$UA" || rc=$?
if broken "$rc"; then echo "fetch: curl error $rc; trying HTTP/1.1" >&2; rc=0; get -A "$UA" --http1.1 || rc=$?; fi
if broken "$rc"; then echo "fetch: curl error $rc; trying curl's own user agent" >&2; rc=0; get --http1.1 || rc=$?; fi
[ "$rc" -eq 0 ] || { echo "fetch: curl failed (error $rc) for $url" >&2; exit 1; }
chmod a-wx "$out"
code=${meta%% *}
rest=${meta#* }
final=${rest%% *}
ctype=${rest#* }
size=$(wc -c < "$out" | tr -d ' ')
echo "$out"
echo "type: $(file -b "$out")${ctype:+ (server: $ctype)}"
echo "size: $size bytes"
echo "status: $code${final:+ from $final}" >&2
case "$code" in 2*|3*) ;; *) echo "fetch: HTTP $code (body kept)" >&2; exit 1 ;; esac
