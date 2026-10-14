# OmniSight Backend — API Server

FastAPI REST API for the OmniSight Multimodal UI Self-Healing & RPA Agent.  
Provides persistent storage for test runs, screenshots, defects, and reports.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Python | 3.12+ |
| Docker Desktop | Latest |
| Git | Any recent version |

---

## Quick Start

### 1. Open a PowerShell terminal in the `backend/` directory

```powershell
cd "D:\Infotact_Solution\Month-1\OmniSight Multimodal UI Self-Healing & RPA Agent\backend"
```

### 2. Start Docker Desktop

Open Docker Desktop from the Start Menu and wait until the whale icon in the
system tray shows "Docker Desktop is running".

### 3. Start PostgreSQL

```powershell
docker compose up -d postgres postgres_test
```

Wait ~15 seconds, then check:

```powershell
docker compose ps
```

Both services should show `(healthy)`.

### 4. Activate the virtual environment

```powershell
.\.venv\Scripts\Activate.ps1
```

> **Tip — Execution Policy Error?**  
> If PowerShell blocks the script, run this once in an **Administrator** terminal:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```
> Then retry the activation command.

### 5. Install dependencies (first time only)

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 6. Create the `.env` file

```powershell
Copy-Item .env.example .env
```

The default credentials match the `docker-compose.yml` values. No changes
are needed for local development.

### 7. Run database migrations

```powershell
alembic upgrade head
```

This creates four tables: `test_runs`, `screenshots`, `defects`, `reports`.

### 8. Start the API server

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API is now available at **http://localhost:8000**.

---

## API Documentation

| URL | Description |
|-----|-------------|
| http://localhost:8000/docs | Swagger UI (interactive) |
| http://localhost:8000/redoc | ReDoc (read-only reference) |
| http://localhost:8000/openapi.json | Raw OpenAPI schema |

---

## Environment Variables

All settings are loaded from `.env`. See `.env.example` for the full list.

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | `OmniSight API` | Application name shown in Swagger UI |
| `APP_ENV` | `development` | Environment label |
| `DEBUG` | `false` | Enable SQL echo logging |
| `API_V1_PREFIX` | `/api/v1` | API route prefix |
| `DATABASE_URL` | see `.env.example` | Primary PostgreSQL connection string |
| `TEST_DATABASE_URL` | see `.env.example` | Test PostgreSQL connection string |
| `FRONTEND_ORIGINS` | `http://localhost:3000` | Comma-separated CORS origins |

---

## Alembic Migration Commands

```powershell
# Apply all pending migrations (always run this after pulling changes)
alembic upgrade head

# Check current revision
alembic current

# Create a new auto-generated migration after editing models
alembic revision --autogenerate -m "describe your change"

# Downgrade one step
alembic downgrade -1

# Generate SQL script without applying (offline mode)
alembic upgrade head --sql
```

---

## Running Tests

The test suite requires the `postgres_test` Docker container (port 5433).

```powershell
# Ensure test DB is running
docker compose up -d postgres_test

# Run all tests
pytest

# Verbose output
pytest -v

# Run a specific test file
pytest tests/test_health.py -v

# Run a specific test function
pytest tests/test_test_runs.py::test_create_test_run -v
```

---

## Example PowerShell API Requests

```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/health" -Method GET

# Create a test run
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/test-runs" -Method POST `
  -ContentType "application/json" `
  -Body '{"run_identifier":"run-3116","name":"Commerce Portal Regression","target_url":"https://commerce.example.com"}'

# List test runs
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/test-runs" -Method GET

# Retrieve by identifier
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/test-runs/run-3116" -Method GET

# Update status
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/test-runs/run-3116" -Method PATCH `
  -ContentType "application/json" `
  -Body '{"status":"passed"}'

# Register screenshot metadata
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/test-runs/run-3116/screenshots" -Method POST `
  -ContentType "application/json" `
  -Body '{"image_type":"baseline","file_path":"storage/screenshots/run-3116/home.png","viewport_width":1920,"viewport_height":1080}'

# Register a defect
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/test-runs/run-3116/defects" -Method POST `
  -ContentType "application/json" `
  -Body '{"defect_type":"color_contrast","severity":"high","description":"Insufficient contrast ratio on CTA button.","confidence_score":0.95}'

# Register a report
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/test-runs/run-3116/reports" -Method POST `
  -ContentType "application/json" `
  -Body '{"report_format":"pdf"}'
```

---

## API Endpoint Reference

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Service identification |
| `GET` | `/api/v1/health` | App + database health |
| `POST` | `/api/v1/test-runs` | Create test run |
| `GET` | `/api/v1/test-runs` | List test runs (paginated) |
| `GET` | `/api/v1/test-runs/{id}` | Get test run |
| `PATCH` | `/api/v1/test-runs/{id}` | Update test run |
| `DELETE` | `/api/v1/test-runs/{id}` | Delete test run |
| `POST` | `/api/v1/test-runs/{id}/screenshots` | Register screenshot |
| `GET` | `/api/v1/test-runs/{id}/screenshots` | List screenshots |
| `POST` | `/api/v1/test-runs/{id}/defects` | Register defect |
| `GET` | `/api/v1/test-runs/{id}/defects` | List defects |
| `PATCH` | `/api/v1/defects/{defect_id}` | Update defect |
| `POST` | `/api/v1/test-runs/{id}/reports` | Register report |
| `GET` | `/api/v1/test-runs/{id}/reports` | List reports |
| `GET` | `/api/v1/reports/{report_id}` | Get report |

---

## Troubleshooting

### `docker: error during connect` / daemon not running
→ Open Docker Desktop from Start Menu and wait for the engine to start (whale icon turns solid).

### `psycopg.OperationalError: connection refused`
→ The PostgreSQL container is not running. Run: `docker compose up -d postgres`

### `alembic.util.exc.CommandError: Can't locate revision`
→ Run `alembic stamp head` to reset the revision pointer, then `alembic upgrade head`.

### PowerShell `cannot be loaded because running scripts is disabled`
→ Run as Administrator: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Port 8000 already in use
→ `netstat -ano | findstr :8000` then `taskkill /PID <pid> /F`

---

## Current Limitations (Day 2)

- **Authentication:** Not yet implemented. All endpoints are public.  
  Add JWT or API-key authentication before any public deployment.
- **Screenshot capture:** Day 2 registers metadata only. Playwright-based  
  capture is implemented in Day 3.
- **Report generation:** Day 2 registers metadata only. PDF/HTML generation  
  is implemented in Day 5.
- **AI defect detection:** Confidence scores are client-provided. AI vision  
  analysis is integrated in Day 4.

---

## Next Steps — Week 1, Day 3

- Playwright browser automation for screenshot capture
- Baseline vs. actual comparison engine
- Automatic screenshot metadata registration via the Day 2 API
- Integration with `POST /api/v1/test-runs/{id}/screenshots`
