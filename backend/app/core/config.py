import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    # API Configuration
    GEMINI_API_KEY: str = ""

    # File Upload Configuration
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10485760  # 10MB

    # CORS Configuration
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # Supported file types
    SUPPORTED_FILE_TYPES: List[str] = [".pdf", ".docx", ".txt"]

    # AI Model Configuration
    GEMINI_MODEL: str = "gemini-1.5-flash"
    MAX_TOKENS: int = 8192
    TEMPERATURE: float = 0.7

    @field_validator('CORS_ORIGINS')
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    class Config:
        env_file = ".env"

settings = Settings()
