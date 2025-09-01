#!/usr/bin/env sh
set -e

# 기본값 설정
: "${WORKERS:=4}"
: "${HOST:=0.0.0.0}"
: "${PORT:=3601}"

exec gunicorn \
    -k uvicorn.workers.UvicornWorker \
    -w "$WORKERS" \
    -b "${HOST}:${PORT}" \
    app.main:app \
    --timeout 60

