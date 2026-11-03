# /// script
# requires-python = ">=3.10"
# dependencies = ["pypdf>=5"]
# ///
"""Match PDFs in public/papers/ to publications, whatever their file names.

    uv run tools/match_papers.py

For each PDF it looks, in order, for:
  1. a known DOI in the PDF text or metadata (most reliable),
  2. a publication title on the first pages,
  3. a file name that resembles a title.
Matches are written to src/data/paper-files.json, which the site reads at build time
to show a "PDF" download button. Runs automatically before `npm run dev` and `npm run build`.
"""
from __future__ import annotations

import json
import logging
import re
import sys
import urllib.parse
from difflib import SequenceMatcher
from pathlib import Path

from pypdf import PdfReader

logging.getLogger("pypdf").setLevel(logging.ERROR)  # font/encoding chatter is not useful here

ROOT = Path(__file__).resolve().parent.parent
PAPERS = ROOT / "public" / "papers"
OUT = ROOT / "src" / "data" / "paper-files.json"
PUBS_TS = ROOT / "src" / "data" / "publications.ts"
CITES = ROOT / "src" / "data" / "citations.json"

DOI_RE = re.compile(r"10\.\d{4,9}/[^\s\"<>]+", re.I)


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


def load_publications() -> list[dict]:
    src = PUBS_TS.read_text(encoding="utf-8")
    pubs = [
        {"id": m[1], "title": m[2].replace("\\'", "'")}
        for m in re.finditer(r"id: '([^']+)', type: '[^']+', year: \d+,\s*title: '((?:[^'\\]|\\.)*)'", src)
    ]
    cites = json.loads(CITES.read_text(encoding="utf-8")) if CITES.exists() else {}
    for p in pubs:
        p["doi"] = (cites.get(p["id"], {}).get("doi") or "").lower()
    return pubs


def pdf_text(path: Path, pages: int = 3) -> tuple[str, str]:
    reader = PdfReader(str(path))
    meta = reader.metadata or {}
    meta_text = " ".join(str(v) for v in meta.values() if v)
    body = []
    for page in reader.pages[:pages]:
        try:
            body.append(page.extract_text() or "")
        except Exception:  # noqa: BLE001 - a broken page should not stop the scan
            pass
    return meta_text, "\n".join(body)


def best_title_match(text: str, pubs: list[dict]) -> tuple[float, dict | None]:
    t = norm(text)
    best: tuple[float, dict | None] = (0.0, None)
    for p in pubs:
        title = norm(p["title"])
        if title and title in t:
            return 1.0, p
        # Compare against same-length windows of the text, sliding by words.
        words, n = t.split(), len(title.split())
        for i in range(0, max(1, len(words) - n + 1), 3):
            r = SequenceMatcher(None, title, " ".join(words[i : i + n])).ratio()
            if r > best[0]:
                best = (r, p)
    return best


def main() -> int:
    pubs = load_publications()
    by_doi = {p["doi"]: p for p in pubs if p["doi"]}
    mapping: dict[str, str] = {}
    report: list[str] = []
    pdfs = sorted(f for f in PAPERS.glob("*") if f.suffix.lower() == ".pdf") if PAPERS.exists() else []

    for f in pdfs:
        url = "/papers/" + urllib.parse.quote(f.name)
        try:
            meta, body = pdf_text(f)
        except Exception as e:  # noqa: BLE001
            report.append(f"  ✗ {f.name}: could not read PDF ({e})")
            continue
        text = f"{meta}\n{body}"
        match, how = None, ""

        for d in DOI_RE.findall(text):
            d = d.rstrip(".,;)]").lower()
            if d in by_doi:
                match, how = by_doi[d], f"DOI {d}"
                break
        if not match:
            score, p = best_title_match(body[:6000], pubs)
            if p and score >= 0.85:
                match, how = p, f"title on page 1 ({score:.0%} match)"
        if not match:
            # Scanned chapters may only carry the book ISBN (e.g. in the PDF title); Springer
            # chapter DOIs embed it (10.1007/<isbn>_<n>). Accept it only if exactly one paper fits.
            hay = f"{f.name} {text}"
            hits = [p for p in pubs if "/978-" in p["doi"]
                    and p["doi"].split("/", 1)[1].split("_")[0] in hay.lower()]
            if len(hits) == 1:
                match, how = hits[0], "book ISBN in file name/metadata"
        if not match:
            stem = norm(f.stem)
            scored = [(SequenceMatcher(None, stem, norm(p["title"])).ratio(), p) for p in pubs]
            score, p = max(scored, key=lambda x: x[0])
            if score >= 0.8:
                match, how = p, f"file name ({score:.0%} match)"

        if not match:
            report.append(f"  ? {f.name}: no publication matched; check it is one of your papers")
            continue
        if match["id"] in mapping:
            report.append(f"  ! {f.name}: also matches {match['id']}, already linked to {mapping[match['id']]}; skipped")
            continue
        mapping[match["id"]] = url
        report.append(f"  ✓ {f.name} → {match['id']}  (by {how})")

    OUT.write_text(json.dumps(dict(sorted(mapping.items())), indent=1) + "\n", encoding="utf-8")
    print(f"Paper PDFs: {len(mapping)} linked, {len(pdfs) - len(mapping)} not linked (public/papers/)")
    print("\n".join(report) if report else "  (no PDFs found)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
