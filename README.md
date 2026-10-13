# chet's site

Personal site for Chet Russell. Flask templates, Markdown notes, and a light/dark minimal theme. It runs as a Flask app (Docker) or freezes to plain static HTML.

## Develop

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
flask --app app run --debug
```

Open http://localhost:5000

## Write a note

Copy `content/notes/_template.md` to `content/notes/<slug>.md`, fill in the frontmatter (`title`, `date`, `summary`), and delete `draft: true` when it's ready. It shows up at `/notes/<slug>/`, and the three newest notes appear on the home page. Files starting with `_` are never published.

## Deploy

**Static** (GitHub Pages, Vercel, Netlify, Cloudflare Pages): `python freeze.py` writes the whole site to `build/`.

**Docker:**

```bash
docker build -t website .
docker run -p 8000:8000 website
```

## Layout

- `templates/base.html`: shared head, nav, footer
- `templates/index.html`: home (intro, projects, notes, now, connect)
- `content/notes/`: Markdown notes
- `static/css/style.css`: theme tokens (`--accent` etc.), light and dark
- `static/js/site.js`: footer ocean scene (wave, kelp, salmon)
