# BRIMSEL AI English Learning Chatbot — Backend

A production-ready, deterministic-first FastAPI backend designed for teaching English to children under 7 years old.

## Features
- **Progressive Learning Engine**: Levels L1 (Beginner), L2 (Elementary), and L3 (Early Conversational).
- **Four Interaction Modes**: `LEARNING`, `CONVERSATION`, `ENGAGEMENT`, and `SUPPORT`.
- **Inferred Emotional Signals**: Detects sadness, frustration, excitement, and confusion with gentle comforting responses.
- **Child Safety Layer**: Enforces strict PII exclusion, regex phone/email filtering, inappropriate keyword rejection, and response sanitization.
- **Bytez LLM Integration**: Asynchronous provider with 5-second timeouts and deterministic fallbacks.
- **Blazing Performance**: Sub-15ms deterministic response time (well within the 2-second target).

---

## Local Setup

### 1. Prerequisites
- Python 3.11 or 3.12

### 2. Environment Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env
```

### 3. Environment Variables (`.env`)
```env
BYTEZ_API_KEY=your_bytez_key_here
BYTEZ_MODEL=Qwen/Qwen3-4B
AI_ENABLED=true
CORS_ORIGINS=http://localhost:3000
MASTERY_THRESHOLD=3
EXTERNAL_TIMEOUT=5.0
```

### 4. Run the Server
```bash
uvicorn app.main:app --reload --port 8000
```
- API Health: `http://localhost:8000/health`
- Interactive Swagger UI: `http://localhost:8000/docs`

---

## Running Tests & Benchmark

```bash
# Run pytest automated test suite (11 tests)
python -m pytest

# Run latency benchmark
python -m tests.benchmark
```

---

## Deployment (Render / Railway / Fly.io)
1. Set the Start Command to: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. Configure `CORS_ORIGINS` to your production frontend domain (e.g. `https://your-frontend.vercel.app`).
