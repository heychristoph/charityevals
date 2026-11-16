#!/bin/sh
# Text of a PDF on stdout, one "=== page N" header per page.
#   scripts/pdf-text.sh <pdf> [pages] [--layout]
#   pages      "5", "3-7" or "1,4,9-12" (1-based; default all)
#   --layout   keep each line's text at its position on the page, so a table's columns stay apart
# macOS PDFKit through scripts/pdf-text.swift (compiled once into $TMPDIR, keyed by the file's hash);
# elsewhere, or if Swift is missing, pypdf in $PDF_TEXT_PYTHON (default python3). No poppler needed.
# PDF_TEXT_ENGINE=pypdf skips PDFKit. The PDF is only read: keep downloads in their own folder.
set -eu
here=$(cd "$(dirname "$0")" && pwd)
pdf=""; pages=""; layout=""
for a in "$@"; do
  case "$a" in
    --layout) layout="--layout" ;;
    -h|--help) sed -n '2,8p' "$0"; exit 0 ;;
    *) if [ -z "$pdf" ]; then pdf="$a"; elif [ -z "$pages" ]; then pages="$a"; else echo "pdf-text: too many arguments" >&2; exit 2; fi ;;
  esac
done
[ -n "$pdf" ] || { sed -n '2,8p' "$0" >&2; exit 2; }
[ -f "$pdf" ] || { echo "pdf-text: no file $pdf" >&2; exit 1; }
case "$pages" in *[!0-9,-]*) echo "pdf-text: bad pages \"$pages\" (5, 3-7 or 1,4,9-12)" >&2; exit 2 ;; esac

swift_src="$here/pdf-text.swift"
if [ "${PDF_TEXT_ENGINE:-}" != pypdf ] && [ "$(uname)" = Darwin ] && command -v swiftc >/dev/null 2>&1; then
  hash=$(shasum -a 256 "$swift_src" | cut -c1-16)
  tmp="${TMPDIR:-/tmp}"; bin="${tmp%/}/charityevals-pdf-text-$hash"
  if [ ! -x "$bin" ]; then
    swiftc -O -o "$bin.tmp.$$" "$swift_src" 2>/dev/null && mv "$bin.tmp.$$" "$bin" || rm -f "$bin.tmp.$$"
  fi
  if [ -x "$bin" ]; then exec "$bin" "$pdf" $pages $layout; fi
  # A compiler that can't link: the interpreter is slower but uses the same SDK.
  if swift "$swift_src" "$pdf" $pages $layout 2>/dev/null; then exit 0; fi
fi

py="${PDF_TEXT_PYTHON:-python3}"
if "$py" -I -c "import pypdf" 2>/dev/null; then
  exec "$py" -I -c '
import sys, pypdf
path, spec, layout = sys.argv[1], sys.argv[2], sys.argv[3] == "--layout"
r = pypdf.PdfReader(path)
if r.is_encrypted:
    r.decrypt("")
n = len(r.pages)
want = []
for part in (spec.split(",") if spec else ["1-%d" % n]):
    a, _, b = part.partition("-")
    want += range(int(a), min(int(b) if b else (n if part.endswith("-") else int(a)), n) + 1)
for i in want:
    print("=== page %d" % i)
    p = r.pages[i - 1]
    try:
        print(p.extract_text(extraction_mode="layout") if layout else p.extract_text())
    except TypeError:  # pypdf before 3.17 has no layout mode
        print(p.extract_text())
' "$pdf" "$pages" "$layout"
fi

echo "pdf-text: no PDF text tool: needs macOS with Swift (xcode-select --install), or pypdf: python3 -m venv <dir> && <dir>/bin/pip install pypdf, then PDF_TEXT_PYTHON=<dir>/bin/python" >&2
exit 1
