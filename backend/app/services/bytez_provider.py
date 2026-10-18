import httpx
from typing import Optional, List, Dict
from app.core.config import settings


class OpenRouterProvider:
    """
    OpenRouter LLM Client.
    Connects to OpenRouter free models with child-safety prompts and deterministic fallback.
    """

    def __init__(self):
        self.key = settings.openrouter_api_key
        self.model = settings.openrouter_model or "liquid/lfm-2.5-2.6b:free"
        self.enabled = settings.ai_enabled and bool(self.key)
        self.timeout = settings.external_timeout

    async def generate_chat_reply(
        self,
        message: str,
        recent_history: Optional[List[Dict[str, str]]] = None,
        context_prompt: Optional[str] = None
    ) -> Optional[str]:
        key = settings.openrouter_api_key
        model = settings.openrouter_model or "nvidia/nemotron-3-ultra-550b-a55b:free"
        if not settings.ai_enabled or not key:
            return None

        system_instruction = (
            "You are 'Buddy', a cheerful, gentle English learning tutor for young children aged 3 to 7. "
            "Keep your response short (under 25 words). "
            "Use simple words a young child easily understands. "
            "Never ask personal questions like real names, locations, schools, or phone numbers. "
            "Be encouraging and warm."
        )

        messages = [{"role": "system", "content": system_instruction}]

        if recent_history:
            for turn in recent_history[-3:]:
                role = "user" if turn.get("role") in ["user", "child"] else "assistant"
                content = str(turn.get("text") or turn.get("content") or "")
                if content:
                    messages.append({"role": role, "content": content[:120]})

        if context_prompt:
            messages.append({"role": "system", "content": context_prompt})

        messages.append({"role": "user", "content": message[:180]})

        try:
            async with httpx.AsyncClient(timeout=settings.external_timeout) as client:
                url = "https://openrouter.ai/api/v1/chat/completions"
                headers = {
                    "Authorization": f"Bearer {key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "BRIMSEL English Buddy"
                }
                payload = {
                    "model": model,
                    "messages": messages,
                    "max_tokens": 70,
                    "temperature": 0.6
                }

                response = await client.post(url, headers=headers, json=payload)

                if response.status_code == 200:
                    data = response.json()
                    if "choices" in data and len(data["choices"]) > 0:
                        choice = data["choices"][0]
                        content = choice.get("message", {}).get("content") or choice.get("text")
                        if content and isinstance(content, str):
                            return content.strip()

                return None
        except Exception:
            return None


openrouter_provider = OpenRouterProvider()
# Alias for backwards compatibility
ai_provider = openrouter_provider
bytez_provider = openrouter_provider
