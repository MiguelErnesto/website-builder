#!/bin/sh
set -eu

cd /app

echo "[entrypoint] Node $(node -v) — npm $(npm -v)"

if [ -f node_modules/.package-lock.json ] && [ -d node_modules/next ]; then
  echo "[entrypoint] node_modules ya instalado, se omite npm install"
else
  npm install
fi

exec "$@"
