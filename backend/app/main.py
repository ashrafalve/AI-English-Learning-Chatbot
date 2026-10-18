from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import settings

app = FastAPI(title=settings.app_name, version=settings.app_version)

# Allow all Vercel previews and configured domains cleanly
cors_origins = settings.cors_list
if "*" not in cors_origins and not any("vercel.app" in o for o in cors_origins):
    cors_origins.extend([
        "https://ai-english-learning-chatbot.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in cors_origins else cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
