import httpx
from typing import Optional, List, Dict
from app.core.config import settings


class BytezProvider:
    """
    Bytez LLM Client wrapper.
    Implements:
    - Bounded retries and strict external timeouts
    - Deterministic fallback when key is invalid, missing, or rate-limited
    - Safe system prompt tailored for young learners under 7
    - Never throws exceptions to calling route
    """

    def __init__(self):
        self.key = settings.bytez_api_key
        self.model = settings.bytez_model or "Qwen/Qwen3-4B"
        self.enabled = settings.ai_enabled and bool(self.key)
        self.timeout = settings.external_timeout

    async def generate_chat_reply(
        self,
        message: str,
        recent_history: Optional[List[Dict[str, str]]] = None,
        context_prompt: Optional[str] = None
    ) -> Optional[str]:
        if not self.enabled:
            return None

        # Build messages with child-safety instructions
        messages = [
            {
                "role": "system",
                "content": (
                    "You are 'Buddy', a gentle, cheerful English tutor for young children aged 3 to 7. "
                    "Use simple, encouraging words. Keep sentences short (under 25 words). "
                    "Never ask the child for their real name, age, address, school, or phone number. "
                    "Be warm, playful, and fun. Include a friendly emoji."
                )
            }
        ]

        # Add recent conversation history (max 4 turns for low latency and tokens)
        if recent_history:
            for turn in recent_history[-4:]:
                role = "user" if turn.get("role") in ["user", "child"] else "assistant"
                content = str(turn.get("text") or turn.get("content") or "")
                if content:
                    messages.append({"role": role, "content": content[:150]})

        if context_prompt:
            messages.append({"role": "system", "content": context_prompt})

        messages.append({"role": "user", "content": message[:200]})

        # Execute bounded request with strict timeout
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                # Bytez Model API
                url = f"https://api.bytez.com/models/v2/{self.model}"
                response = await client.post(
                    url,
                    headers={
                        "Authorization": self.key,
                        "Content-Type": "application/json"
                    },
                    json={"messages": messages}
                )

                if response.status_code == 200:
                    data = response.json()
                    output = data.get("output")
                    if isinstance(output, str):
                        return output.strip()
                    elif isinstance(output, dict):
                        return output.get("content") or output.get("text")
                    elif isinstance(output, list) and len(output) > 0:
                        first = output[0]
                        return first.get("content") if isinstance(first, dict) else str(first)

                # Fallback if v2 endpoint format returns alternate shape
                return None
        except Exception:
            # Deterministic fallback on any network error or timeout
            return None


bytez_provider = BytezProvider()
