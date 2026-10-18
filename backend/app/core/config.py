import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "BRIMSEL English Learning Chatbot"
    app_version: str = "1.0.0"
    cors_origins: str = "http://localhost:3000"
    
    # OpenRouter AI Configuration
    openrouter_api_key: str = ""
    openrouter_model: str = "liquid/lfm-2.5-2.6b:free"
    ai_enabled: bool = True
    
    max_history: int = 10
    max_message_length: int = 500
    mastery_threshold: int = 3
    external_timeout: float = 8.0

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

    @property
    def cors_list(self):
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
