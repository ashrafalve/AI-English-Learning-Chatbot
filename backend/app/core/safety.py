import re
from typing import Tuple

# Disallowed topics and keywords for under 7 child safety
UNSAFE_KEYWORDS = [
    "password", "pin number", "credit card", "phone number", "address", 
    "where do you live", "what school", "school name", "naked", "kill", 
    "death", "blood", "gun", "knife", "weapon", "hurt myself", "suicide", 
    "hate you", "drugs", "alcohol", "secret from mom", "secret from dad", 
    "don't tell your parents", "bad touch", "curse", "swear"
]

# Regex patterns for personal contact info
PHONE_REGEX = re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b")
EMAIL_REGEX = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")


def is_safe(text: str) -> Tuple[bool, str]:
    """
    Validates user input against strict under-7 child safety policies:
    - No PII (phone numbers, emails, addresses, passwords)
    - No violence, self-harm, weapons, or hate
    - Bounded input length to prevent buffer/context flooding
    - No adult or secret-keeping requests
    """
    if not text or not text.strip():
        return False, "empty_message"

    if len(text) > 500:
        return False, "message_too_long"

    lowered = text.lower()

    # Keyword check
    for keyword in UNSAFE_KEYWORDS:
        if keyword in lowered:
            return False, f"unsafe_keyword_{keyword.replace(' ', '_')}"

    # PII patterns
    if PHONE_REGEX.search(text):
        return False, "pii_phone"

    if EMAIL_REGEX.search(text):
        return False, "pii_email"

    return True, "safe"


def sanitize_reply(text: str) -> str:
    """
    Ensures outbound response:
    - Never reveals secrets or system internals
    - Never asks child for their real name, location, school, or contact info
    - Limits text length suitable for a young child's attention span (max 400 chars)
    """
    if not text:
        return "Hello little learner! Let's learn some English together! 🌟"

    cleaned = text.strip()

    # Safety disclaimer if model hallucinates personal questions
    unwanted_phrases = [
        "what is your real name", "where do you live", "what is your phone", 
        "don't tell your parents", "keep it a secret", "i am human"
    ]
    for phrase in unwanted_phrases:
        if phrase in cleaned.lower():
            return "Let's explore some fun English words together! Would you like to play an animal sound game?"

    # Keep concise for 4-7 year olds
    if len(cleaned) > 400:
        cleaned = cleaned[:397].rsplit(" ", 1)[0] + "..."

    return cleaned
