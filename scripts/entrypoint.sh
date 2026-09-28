#!/bin/sh
set -eu

cd /app

echo "[entrypoint] Node $(node -v) — npm $(npm -v)"

npm install

exec "$@"
