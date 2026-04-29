## Dev Notes

### 1. Prerequisites

- Docker Engine + Docker Compose v2
- Git

### 2. Clone and enter project

```bash
git clone <YOUR_REPO_URL>
cd dev-notes
```

### 3. Configure environment

```bash
cp .env.example .env
```

If `./.env` already exists, just verify values inside it.

### 4. Start project

Run all Docker commands from `dev-notes` root:

```bash
docker compose config
docker compose up -d --build
```

### 5. Check status

```bash
docker compose ps
docker compose logs -f
```

### 6. Stop project

```bash
docker compose down
```

### 7. Useful reset for clean start

If you changed PostgreSQL major versions or got broken DB state:

```bash
docker compose down -v
docker compose up -d --build
```

### 8. Where to see logs

- Open Grafana: `http://localhost:3002`
- Go to `Explore`
- Select datasource: `Loki`
- Use query:

```logql
{container=~"core_service|search_service"}
```
