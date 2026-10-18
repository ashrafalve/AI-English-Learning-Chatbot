# System Design Document: BRIMSEL AI English Learning Chatbot

## 1. Stateless & Deterministic-First Philosophy
Because this MVP intentionally avoids heavyweight databases (PostgreSQL/Redis), the backend is stateless:
- The frontend holds the learner's session state in `localStorage` and provides it with requests.
- The backend evaluates every answer objectively using deterministic rules.
- Even if the Bytez AI key is absent, expired, or down, 100% of the lessons, hint systems, progressions, and safety guardrails work seamlessly.

## 2. Progressive Learning Engine
- **Mastery Threshold**: Configurable threshold (default `3` consecutive points) needed before graduating to the next level.
- **Mistake & Remedial Logic**: If a learner makes 2 consecutive mistakes on a lesson, `remedial_needed` is flagged and an explicit gentle hint is provided.
- **Levels**:
  - `L1`: Colors, animals, numbers, alphabet, everyday objects.
  - `L2`: Basic sentences, common verbs, everyday questions, simple grammar.
  - `L3`: Storytelling, comprehension, descriptive feelings.

## 3. Child Safety & Emotional Support
- Young children under 7 must never be asked for personal data (names, schools, addresses, phone numbers).
- Inferred emotional states (sadness, frustration) trigger the `SUPPORT` mode immediately, offering comfort and recommending speaking with parents or trusted adults.
