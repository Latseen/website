"""Portfolio site for ML/Data Engineer — Flask + Gunicorn."""
from datetime import datetime
from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return render_template(
        "index.html",
        current_year=datetime.utcnow().year,
    )


@app.route("/health")
def health():
    return {"status": "ok"}, 200
