import uuid
from typing import Optional
from fastapi import APIRouter, Query, HTTPException
from app.core.lessons import lessons_for_level, get_lesson, LEVELS
from app.core.intent import detect_intent
from app.core.safety import is_safe, sanitize_reply
from app.services.learning_service import learning_service
from app.services.bytez_provider import bytez_provider
from app.schemas.chat import ChatRequest, ChatResponse, ProgressEvalRequest, ProgressEvalResponse
from app.core.config import settings

router = APIRouter()


@router.get("/health")
def health():
    return {
        "status": "ok",
        "app_name": settings.app_name,
        "version": settings.app_version,
        "ai_configured": bool(settings.openrouter_api_key and settings.ai_enabled)
    }


@router.get("/api/lessons")
def get_lessons(level: str = Query("L1")):
    if level not in LEVELS:
        raise HTTPException(status_code=400, detail=f"Invalid level '{level}'. Must be one of {LEVELS}")
    return {"level": level, "lessons": lessons_for_level(level)}


@router.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    request_id = str(uuid.uuid4())

    # 1. Child Safety Validation
    safe, reason = is_safe(req.message)
    if not safe:
        return ChatResponse(
            reply="I cannot help with that. Let's learn friendly English words together! 🌈",
            mode="SUPPORT",
            detected_intent="unsafe",
            detected_emotion_signal="neutral",
            current_level=req.current_level,
            lesson_id=req.current_lesson_id,
            answer_correct=None,
            hint=None,
            feedback="Safety redirect applied.",
            progress=req.learner_state.dict() if req.learner_state else {},
            next_suggestion="Choose a lesson to begin learning!",
            response_source="safety-filter",
            request_id=request_id
        )

    # 2. Intent and Inferred Emotion Signal Detection
    intent, emotion = detect_intent(req.message)

    # 3. Determine Interaction Mode
    if intent == "engagement":
        mode = "ENGAGEMENT"
    elif intent in ["emotional", "confusion"]:
        mode = "SUPPORT"
    elif intent in ["question", "general_chat"] and not req.current_lesson_id:
        mode = "CONVERSATION"
    else:
        mode = "LEARNING"

    level = req.current_level
    lesson_id = req.current_lesson_id
    progress = req.learner_state.dict() if req.learner_state else {
        "mastery": 0, "level": level, "streak": 0, "completed_lessons": [], "mistake_count": 0
    }

    answer_correct: Optional[bool] = None
    hint: Optional[str] = None
    feedback: str = "Let's keep learning together! 🚀"
    reply: str = ""
    next_suggestion: str = "Try answering the lesson question."
    response_source: str = "rule-based"

    # 4. If child asks a curiosity question or general chat, answer with AI (even if lesson is open)
    if intent in ["question", "general_chat"]:
        mode = "CONVERSATION"
        ai_reply = None
        if settings.ai_enabled and settings.openrouter_api_key:
            ai_reply = await bytez_provider.generate_chat_reply(
                message=req.message,
                recent_history=req.recent_history,
                context_prompt=f"The child is learning English at Level {level}. Provide a 1-sentence warm, simple explanation."
            )

        if ai_reply:
            reply = ai_reply
            response_source = "openrouter-llm"
        else:
            if "tiger" in req.message.lower():
                reply = "A tiger is a big, beautiful orange cat with black stripes that loves to roar! 🐅"
            elif "sun" in req.message.lower():
                reply = "The sun is a big, bright star in the sky that keeps us warm and gives us light! ☀️"
            elif any(w in req.message.lower() for w in ["hello", "hi", "hey"]):
                reply = "Hello there! I'm Buddy, your English learning pal. Are you ready for a fun lesson? 🌟"
            else:
                reply = f"That is a great question! English is full of wonders. Would you like to practice Level {level} lessons?"
        next_suggestion = "Ask another question or try the lesson above!"

    # 5. Specialized Mode Handling (Engagement, Emotional, Confusion)
    elif intent == "engagement":
        mode = "ENGAGEMENT"
        reply = "Let's play a game! Can you name your favorite animal in English? 🐶🐱🦁"
        next_suggestion = "Type an animal name like dog, lion, or elephant!"

    elif intent == "emotional":
        mode = "SUPPORT"
        if emotion == "sad":
            reply = "I'm so sorry you're feeling down. You are doing great today! 💛 Remember to talk to a parent or trusted adult for a warm hug."
        elif emotion == "frustrated":
            reply = "It's completely okay to feel frustrated! Learning new words takes time. Let's take a deep breath together. 🎈"
        elif emotion == "excited":
            reply = "Yay! Your happy energy makes me smile! Let's learn more awesome English words! 🌟"
        next_suggestion = "Whenever you're ready, we can practice a fun word."

    elif intent == "confusion":
        mode = "SUPPORT"
        reply = "No worries at all! Let's take it step by step. Would you like a gentle hint or an easier example? 💡"
        next_suggestion = "Click the Hint button or try an easier question."

    # 6. Otherwise, evaluate as an answer to the active lesson
    elif lesson_id:
        mode = "LEARNING"
        lesson = get_lesson(lesson_id)
        if lesson:
            eval_result = learning_service.evaluate(lesson_id, level, req.message, progress)
            answer_correct = eval_result["correct"]
            hint = eval_result["hint"]
            feedback = eval_result["feedback"]
            progress = eval_result["progress"]
            level = eval_result["next_level"]
            reply = feedback

            if eval_result.get("remedial_needed"):
                next_suggestion = f"Hint: {hint}. You can do it!"
            elif answer_correct:
                next_suggestion = "Ready for the next fun lesson?"
            else:
                next_suggestion = "Give it another try!"

    # Final response sanitization and constraints
    final_reply = sanitize_reply(reply or "Great effort! Let's keep exploring English together! ✨")

    return ChatResponse(
        reply=final_reply,
        mode=mode,
        detected_intent=intent,
        detected_emotion_signal=emotion,
        current_level=level,
        lesson_id=lesson_id,
        answer_correct=answer_correct,
        hint=hint,
        feedback=feedback,
        progress=progress,
        next_suggestion=next_suggestion,
        response_source=response_source,
        request_id=request_id
    )


@router.post("/api/progress/evaluate", response_model=ProgressEvalResponse)
def evaluate_progress(req: ProgressEvalRequest):
    res = learning_service.evaluate(req.lesson_id, req.level, req.answer, req.progress)
    return ProgressEvalResponse(
        correct=res["correct"],
        hint=res["hint"],
        feedback=res["feedback"],
        mastery=res["mastery"],
        next_level=res["next_level"],
        progress=res["progress"],
        remedial_needed=res.get("remedial_needed", False)
    )
