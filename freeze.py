"""Render the site to static HTML in build/ for any static host.

    python freeze.py
"""
from flask_frozen import Freezer

from app import app, load_notes

app.config["FREEZER_DESTINATION"] = "build"
freezer = Freezer(app, with_no_argument_rules=False)


@freezer.register_generator
def index():
    yield {}


@freezer.register_generator
def notes():
    yield {}


@freezer.register_generator
def note():
    for n in load_notes():
        yield {"slug": n["slug"]}


if __name__ == "__main__":
    freezer.freeze()
    with app.test_request_context():
        from flask import render_template
        (freezer.root / "404.html").write_text(render_template("404.html"), encoding="utf-8")
    print(f"Built static site in {freezer.root}")
