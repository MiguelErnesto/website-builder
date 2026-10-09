# Catálogo web

Catálogo público (español / inglés) con ficha de producto y panel `/admin`. Una sola app: **Payload CMS 3 + Next.js + PostgreSQL**.

El visitante ve productos. El editor gestiona el catálogo en `/admin`. No hay carrito ni API HTTP pública.

## Requisitos

- Git
- Docker y Docker Compose  
  No hace falta Node.js en el PC.

Imágenes Docker que ya deben estar en el equipo (no se descargan):

- `postgres:16-alpine`
- `planificador-eventos_app:latest` (base Node 22; sale de [planificador-eventos](https://github.com/MiguelErnesto/planificador-eventos) si ya lo construiste)

El puerto **5432** del host lo usa el planificador. Este proyecto publica Postgres en **5434**.

## Instalar y ejecutar

### 1. Clonar

```bash
cd /home/miguel/proyectos
git clone <url-del-repo> catalogo-web
cd catalogo-web
```

### 2. Variables de entorno

```bash
cp .env.example .env
```

En `.env` deja `DATABASE_URL` tal cual (el contenedor habla con Postgres por la red de Compose). Cambia `PAYLOAD_SECRET` por una cadena larga aleatoria.

### 3. Arrancar

```bash
docker compose up --build
```

La primera vez:

1. Construye la imagen de la app.
2. Levanta Postgres (`website-builder-postgres`) y espera a que esté sano.
3. Instala dependencias npm **dentro** del contenedor.
4. Arranca Next.js en el puerto 3000.
5. Si la base está vacía, crea el admin y **25 productos** con imagen.

Espera a ver `Ready` en los logs.

### 4. Abrir

| Qué | URL |
| --- | --- |
| Catálogo (ES, por defecto) | http://localhost:3000 |
| Catálogo en inglés | http://localhost:3000/en |
| Admin | http://localhost:3000/admin |

## Login del admin

Tras el primer arranque (base vacía):

- **URL:** http://localhost:3000/admin
- **Email:** `admin@email.com`
- **Contraseña:** `admin1234`

El seed es idempotente: si ya hay usuarios o productos, no los vuelve a crear.

## Parar

```bash
docker compose down
```

Los datos de Postgres quedan en el volumen `catalogo_web_pgdata`. Para borrar también la base:

```bash
docker compose down -v
```

El siguiente `docker compose up --build` volverá a sembrar admin y catálogo.

## Notas

- Host Postgres: `localhost:5434` (usuario / clave / base: `catalogo`).
- La app en Compose usa `postgres:5432` dentro de la red Docker, no el 5434 del host.
- Node en el PC no hace falta; `npm install` lo ejecuta el entrypoint del contenedor.
