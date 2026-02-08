# ML/Data Engineer Portfolio

A developer portfolio site for an ML/Data Engineer who works at startups. Built with Flask and Gunicorn, packaged in Docker.

## Run with Docker

```bash
docker build -t website .
docker run -p 8000:8000 website
```

Open http://localhost:8000

## Run locally (no Docker)

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
gunicorn app:app --bind 0.0.0.0:8000
```

## Customize

- **Content**: Edit `templates/index.html` — hero, about, experience (Startup Alpha/Beta/Gamma), skills, projects, and contact (email, GitHub, LinkedIn).
- **Styling**: Edit `static/css/style.css` — colors (e.g. `--accent`), typography, and layout.

## Endpoints

- `GET /` — Portfolio home
- `GET /health` — Health check (JSON)
