// Text of a PDF on stdout, with macOS PDFKit (scripts/pdf-text.sh compiles and runs this; call that).
//   pdf-text <pdf> [pages] [--layout]
// pages: "5", "3-7" or "1,4,9-12" (1-based; default all). Each page starts with "=== page N".
// --layout places each line's text by its position on the page (columns of a table stay apart), like
// pdftotext -layout; without it, PDFKit's reading order.
import Foundation
import PDFKit

func fail(_ msg: String) -> Never {
  FileHandle.standardError.write((msg + "\n").data(using: .utf8)!)
  exit(1)
}

var args = Array(CommandLine.arguments.dropFirst())
let layout = args.contains("--layout")
args.removeAll { $0 == "--layout" }
guard let path = args.first else { fail("usage: pdf-text <pdf> [pages] [--layout]") }
guard let doc = PDFDocument(url: URL(fileURLWithPath: path)) else { fail("cannot open \(path) as a PDF") }
if doc.isLocked && !doc.unlock(withPassword: "") { fail("\(path) is password-protected") }

func pages(_ spec: String?, count: Int) -> [Int] {
  guard let spec = spec, !spec.isEmpty else { return Array(1...max(count, 1)).filter { $0 <= count } }
  var out: [Int] = []
  for part in spec.split(separator: ",") {
    let ends = part.split(separator: "-", omittingEmptySubsequences: false).map { Int($0.trimmingCharacters(in: .whitespaces)) }
    guard let a = ends.first ?? nil else { fail("bad page spec \(spec)") }
    let b = ends.count > 1 ? (ends[1] ?? count) : a
    if a < 1 || b < a { fail("bad page range \(part)") }
    out += Array(a...min(b, count))
  }
  return out
}

/// The page's text on a grid: PDFKit's lines, those at the same height joined into one row, and each
/// character at its x over the page's typical character width (so a table's columns line up).
func layoutText(_ page: PDFPage) -> String {
  guard let s = page.string as NSString?, s.length > 0,
        let all = page.selection(for: page.bounds(for: .cropBox)) else { return "" }
  struct C { let ch: String; let x: CGFloat; let w: CGFloat }
  struct L { let y: CGFloat; let h: CGFloat; var cs: [C] }
  var lines: [L] = []
  for sel in all.selectionsByLine() {
    let b = sel.bounds(for: page)
    var cs: [C] = []
    for t in 0..<sel.numberOfTextRanges(on: page) {
      let r = sel.range(at: t, on: page)
      guard r.location != NSNotFound else { continue }
      for i in r.location..<min(r.location + r.length, s.length) {
        let ch = s.substring(with: NSRange(location: i, length: 1))
        if ch.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty { continue }
        // A one-character selection's bounds (characterBounds(at:) counts characters differently).
        guard let cb = page.selection(for: NSRange(location: i, length: 1))?.bounds(for: page) else { continue }
        cs.append(C(ch: ch, x: cb.minX, w: max(cb.width, 0)))
      }
    }
    if !cs.isEmpty { lines.append(L(y: b.midY, h: b.height, cs: cs)) }
  }
  if lines.isEmpty { return "" }
  let widths = lines.flatMap { $0.cs.map { $0.w } }.filter { $0 > 0 }.sorted()
  let cw = max(widths.isEmpty ? 5 : widths[widths.count / 2], 1)
  // Top of the page first; a line joins the row whose middle is within half its height.
  lines.sort { $0.y > $1.y }
  var rows: [L] = []
  for l in lines {
    if let k = rows.indices.last, abs(rows[k].y - l.y) <= min(rows[k].h, l.h) * 0.5 { rows[k].cs += l.cs } else { rows.append(l) }
  }
  let minX = lines.flatMap { $0.cs.map { $0.x } }.min() ?? 0
  var out: [String] = []
  for row in rows {
    var text = ""
    var col = 0
    var last: C? = nil
    for c in row.cs.sorted(by: { $0.x < $1.x }) {
      // Within a word (a gap under about a third of the letters' width) letters follow on, whatever the
      // font size; after a gap the text moves to its column on the grid, at least one space on.
      if let p = last, c.x - (p.x + p.w) <= 0.35 * max((p.w + c.w) / 2, cw * 0.5) {
        text += c.ch
      } else {
        let want = Int(((c.x - minX) / cw).rounded())
        let pad = last == nil ? max(want - col, 0) : max(want - col, 1)
        text += String(repeating: " ", count: pad)
        col += pad
        text += c.ch
      }
      col += 1
      last = c
    }
    out.append(text)
  }
  return out.joined(separator: "\n")
}

for n in pages(args.count > 1 ? args[1] : nil, count: doc.pageCount) {
  guard let page = doc.page(at: n - 1) else { continue }
  print("=== page \(n)")
  print(layout ? layoutText(page) : (page.string ?? ""))
}
