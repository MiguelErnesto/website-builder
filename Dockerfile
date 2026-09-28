FROM node:22-bookworm

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN printf 'DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build"\nPAYLOAD_SECRET="build-secret-not-used-in-runtime"\n' > .env \
  && npm ci

COPY . .

RUN printf 'DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build"\nPAYLOAD_SECRET="build-secret-not-used-in-runtime"\n' > .env \
  && npm run build \
  && rm -f .env

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

CMD ["sh", "-c", "npx payload migrate && npx next start --hostname 0.0.0.0 --port ${PORT:-3000}"]
