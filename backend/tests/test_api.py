import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    r = client.get("/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert "ai_configured" in data


def test_lesson_retrieval_l1():
    r = client.get("/api/lessons?level=L1")
    assert r.status_code == 200
    data = r.json()
    assert data["level"] == "L1"
    assert len(data["lessons"]) >= 3
    first = data["lessons"][0]
    assert "id" in first
    assert "question" in first
    assert "options" in first
    assert "hint" in first


def test_invalid_level():
    r = client.get("/api/lessons?level=L99")
    assert r.status_code == 400


def test_chat_correct_answer():
    r = client.post("/api/chat", json={
        "message": "blue",
        "current_level": "L1",
        "current_lesson_id": "l1_colors_sky"
    })
    assert r.status_code == 200
    d = r.json()
    assert d["answer_correct"] is True
    assert d["mode"] == "LEARNING"
    assert "blue" in d["reply"].lower()


def test_chat_incorrect_answer_and_hint():
    r = client.post("/api/chat", json={
        "message": "red",
        "current_level": "L1",
        "current_lesson_id": "l1_colors_sky"
    })
    assert r.status_code == 200
    d = r.json()
    assert d["answer_correct"] is False
    assert d["hint"] is not None


def test_l1_to_l2_progression():
    # Progress with mastery 2 should reach threshold 3 on correct answer and advance to L2
    r = client.post("/api/progress/evaluate", json={
        "lesson_id": "l1_colors_sky",
        "level": "L1",
        "answer": "blue",
        "progress": {"mastery": 2}
    })
    assert r.status_code == 200
    d = r.json()
    assert d["correct"] is True
    assert d["next_level"] == "L2"
    assert d["mastery"] == 0  # reset for next level


def test_repeated_mistakes_remedial():
    # Progress with mistake_count 1 becomes 2 on wrong answer, triggering remedial_needed
    r = client.post("/api/progress/evaluate", json={
        "lesson_id": "l1_colors_sky",
        "level": "L1",
        "answer": "purple",
        "progress": {"mistake_count": 1, "mastery": 1}
    })
    assert r.status_code == 200
    d = r.json()
    assert d["correct"] is False
    assert d["remedial_needed"] is True
    assert "Hint:" in d["feedback"]


def test_four_modes():
    # Learning
    r1 = client.post("/api/chat", json={"message": "blue", "current_level": "L1", "current_lesson_id": "l1_colors_sky"})
    assert r1.json()["mode"] == "LEARNING"

    # Engagement
    r2 = client.post("/api/chat", json={"message": "Let's play a game", "current_level": "L1"})
    assert r2.json()["mode"] == "ENGAGEMENT"

    # Support (emotional)
    r3 = client.post("/api/chat", json={"message": "I feel sad today", "current_level": "L1"})
    assert r3.json()["mode"] == "SUPPORT"

    # Conversation (open question without active lesson)
    r4 = client.post("/api/chat", json={"message": "What is a tiger?", "current_level": "L1"})
    assert r4.json()["mode"] == "CONVERSATION"


def test_emotional_support_behavior():
    r = client.post("/api/chat", json={"message": "I am feeling frustrated and angry", "current_level": "L1"})
    assert r.status_code == 200
    d = r.json()
    assert d["mode"] == "SUPPORT"
    assert d["detected_emotion_signal"] == "frustrated"


def test_unsafe_input_pii_handling():
    # Attempt to disclose password and phone number
    r1 = client.post("/api/chat", json={"message": "my password is secret123", "current_level": "L1"})
    assert r1.status_code == 200
    assert "cannot help" in r1.json()["reply"].lower()

    r2 = client.post("/api/chat", json={"message": "Call me at 555-123-4567", "current_level": "L1"})
    assert r2.status_code == 200
    assert "cannot help" in r2.json()["reply"].lower()


def test_invalid_schema():
    r = client.post("/api/chat", json={"message": ""})
    assert r.status_code == 422
