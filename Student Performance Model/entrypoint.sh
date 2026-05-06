#!/usr/bin/env bash
set -e

# Try to download model if MODEL_URL is set
python download_model.py || true

# Start Gunicorn with Uvicorn workers (production-ready)
exec gunicorn -k uvicorn.workers.UvicornWorker main:app \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers ${WEB_CONCURRENCY:-2} \
    --log-level info \
    --access-logfile - \
    --error-logfile -
