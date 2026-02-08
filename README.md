# Website

A minimal Python web app served by [Gunicorn](https://gunicorn.org/) and packaged in Docker.

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

## Endpoints

- `GET /` — Home page
- `GET /health` — Health check (JSON)
