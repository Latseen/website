FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY templates/ templates/
COPY static/ static/

ENV GUNICORN_CMD_ARGS="--bind 0.0.0.0:8000 --workers 1 --threads 2"
EXPOSE 8000

CMD ["gunicorn", "app:app"]
