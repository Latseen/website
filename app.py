"""Minimal Flask app for Gunicorn."""
from flask import Flask

app = Flask(__name__)


@app.route("/")
def index():
    return "<!DOCTYPE html><html><head><title>Website</title></head><body><h1>Hey baby bear :)</h1><p>Running in Docker.</p></body></html>"


@app.route("/health")
def health():
    return {"status": "ok"}, 200
