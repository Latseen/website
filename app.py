"""Personal site — Flask + Gunicorn, freezable to static HTML (see freeze.py)."""
from datetime import date
from pathlib import Path

import markdown
from flask import Flask, abort, render_template

app = Flask(__name__)

NOTES_DIR = Path(__file__).parent / "content" / "notes"
SITE_DESCRIPTION = (
    "Chet Russell — backend engineer working on AI infrastructure for climate risk at Arbol."
)


def _parse_note(path):
    """Read a note: `key: value` frontmatter between `---` lines, then Markdown."""
    text = path.read_text(encoding="utf-8")
    meta = {}
    if text.startswith("---"):
        _, header, text = text.split("---", 2)
        for line in header.strip().splitlines():
            key, _, value = line.partition(":")
            meta[key.strip()] = value.strip()
    return {
        "slug": path.stem,
        "title": meta.get("title", path.stem.replace("-", " ").title()),
        "date": date.fromisoformat(meta["date"]) if "date" in meta else None,
        "summary": meta.get("summary", ""),
        "draft": meta.get("draft", "").lower() == "true",
        "html": markdown.markdown(text, extensions=["fenced_code", "smarty"]),
    }


def load_notes():
    """Published notes, newest first. Files starting with `_` and drafts are skipped."""
    notes = [
        _parse_note(p)
        for p in NOTES_DIR.glob("*.md")
        if not p.name.startswith("_")
    ]
    notes = [n for n in notes if not n["draft"]]
    return sorted(notes, key=lambda n: n["date"] or date.min, reverse=True)


@app.context_processor
def inject_globals():
    return {"site_description": SITE_DESCRIPTION}


@app.route("/")
def index():
    return render_template("index.html", notes=load_notes()[:3])


@app.route("/notes/")
def notes():
    return render_template("notes.html", notes=load_notes())


@app.route("/notes/<slug>/")
def note(slug):
    match = next((n for n in load_notes() if n["slug"] == slug), None)
    if match is None:
        abort(404)
    return render_template("note.html", note=match)


@app.errorhandler(404)
def not_found(_):
    return render_template("404.html"), 404


@app.route("/health")
def health():
    return {"status": "ok"}, 200
