"""
OmniSight API — Application configuration.

Settings are loaded from environment variables / .env file using
pydantic-settings.  Sensitive values (passwords, keys) must never
be hard-coded here; they come exclusively from the environment.
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application-wide settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        # Extra fields in .env are ignored rather than raising an error.
        extra="ignore",
    )

    # ---- Application -------------------------------------------------------
    app_name: str = "OmniSight API"
    app_env: str = "development"
    debug: bool = False

    # ---- API ---------------------------------------------------------------
    api_v1_prefix: str = "/api/v1"

    # ---- Database (primary) ------------------------------------------------
    database_url: str = (
        "postgresql+psycopg://omnisight:omnisight_dev_pass@localhost:5432/omnisight_db"
    )

    # ---- Database (test) ---------------------------------------------------
    test_database_url: str = (
        "postgresql+psycopg://omnisight:omnisight_dev_pass@localhost:5433/omnisight_test_db"
    )

    # ---- CORS --------------------------------------------------------------
    # Provide a comma-separated list in the environment variable, e.g.:
    #   FRONTEND_ORIGINS=http://localhost:3000,http://localhost:3001
    frontend_origins: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> List[str]:
        """Return parsed CORS origin list."""
        return [o.strip() for o in self.frontend_origins.split(",") if o.strip()]

    # ---- File Storage ------------------------------------------------------
    storage_base_path: str = "./storage"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached singleton Settings instance."""
    return Settings()
