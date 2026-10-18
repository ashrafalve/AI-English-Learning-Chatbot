from typing import Tuple


def detect_intent(message: str) -> Tuple[str, str]:
    """
    Classifies intent and inferred emotional signals for children under 7.
    Returns (intent, emotion_signal):
    - intent: "learning", "engagement", "emotional", "confusion", "question", "general_chat"
    - emotion_signal: "neutral", "sad", "frustrated", "excited", "curious", "uncertain"
    """
    m = message.lower().strip()

    # 1. Emotional expressions (sadness, frustration, excitement)
    if any(w in m for w in ["sad", "crying", "cry", "upset", "tears", "lonely", "miss my"]):
        return "emotional", "sad"

    if any(w in m for w in ["angry", "mad", "hate this", "hard", "frustrated", "i can't"]):
        return "emotional", "frustrated"

    if any(w in m for w in ["happy", "excited", "yay", "yey", "hurray", "love this", "fun", "cool"]):
        return "emotional", "excited"

    # 2. Confusion / Needs Remedial Help
    if any(w in m for w in ["don't understand", "dont understand", "confused", "help", "too hard", "what does that mean", "explain"]):
        return "confusion", "uncertain"

    # 3. Engagement (Game, Story, Play, Riddles)
    if any(w in m for w in ["play", "game", "story", "tell me a story", "riddle", "joke", "fun activity"]):
        return "engagement", "excited"

    # 4. Inquisitive Questions (e.g. "What is a tiger?", "Why is the sun yellow?")
    if any(m.startswith(w) for w in ["what is", "what are", "why is", "who is", "how do", "can you tell me"]) or "?" in m:
        return "question", "curious"

    # 5. Greetings
    if any(w in m for w in ["hello", "hi", "hey", "good morning", "good afternoon"]):
        return "general_chat", "neutral"

    # Default to learning context evaluation
    return "learning", "neutral"
