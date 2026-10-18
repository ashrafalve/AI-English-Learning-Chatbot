from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class LearnerState(BaseModel):
    current_level: str = "L1"
    current_lesson_id: Optional[str] = None
    mastery: int = 0
    streak: int = 0
    mistake_count: int = 0
    completed_lessons: List[str] = Field(default_factory=list)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500)
    current_level: str = Field(default="L1")
    current_lesson_id: Optional[str] = None
    learner_state: Optional[LearnerState] = None
    recent_history: Optional[List[Dict[str, str]]] = None


class ChatResponse(BaseModel):
    reply: str
    mode: str
    detected_intent: str
    detected_emotion_signal: str
    current_level: str
    lesson_id: Optional[str] = None
    answer_correct: Optional[bool] = None
    hint: Optional[str] = None
    feedback: str
    progress: Dict[str, Any]
    next_suggestion: str
    response_source: str
    request_id: str


class ProgressEvalRequest(BaseModel):
    lesson_id: str
    level: str
    answer: str
    progress: Dict[str, Any] = Field(default_factory=dict)


class ProgressEvalResponse(BaseModel):
    correct: bool
    hint: Optional[str] = None
    feedback: str
    mastery: int
    next_level: str
    progress: Dict[str, Any]
    remedial_needed: bool = False
