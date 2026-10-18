from typing import Dict, Any, Optional
from app.core.lessons import get_lesson, lessons_for_level, LEVELS


class LearningService:
    def __init__(self, threshold: int = 3):
        self.threshold = threshold

    def evaluate(self, lesson_id: str, level: str, answer: str, progress: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Evaluates a learner's answer against the target lesson and updates mastery state.
        Never advances purely on one answer: requires achieving configured mastery threshold.
        """
        prog = dict(progress) if progress else {}
        mastery = int(prog.get("mastery", 0))
        streak = int(prog.get("streak", 0))
        completed_lessons = list(prog.get("completed_lessons", []))
        mistake_count = int(prog.get("mistake_count", 0))

        lesson = get_lesson(lesson_id)
        if not lesson:
            return {
                "correct": False,
                "hint": "Let's choose a lesson to learn!",
                "feedback": "I couldn't find that specific lesson, but we can try another one!",
                "mastery": mastery,
                "next_level": level,
                "progress": prog,
                "remedial_needed": False
            }

        # Check answer against accepted matches
        cleaned_answer = answer.strip().lower()
        accepted = [a.lower().strip() for a in lesson["accepted"]]
        is_correct = any(cleaned_answer == acc or acc in cleaned_answer for acc in accepted)

        remedial_needed = False
        new_level = level

        if is_correct:
            mastery += 1
            streak += 1
            mistake_count = 0
            feedback = lesson.get("feedback", "Excellent job! You got it right! ⭐")
            hint = None
            if lesson_id not in completed_lessons:
                completed_lessons.append(lesson_id)

            # Check level progression threshold
            if mastery >= self.threshold:
                current_idx = LEVELS.index(level) if level in LEVELS else 0
                if current_idx < len(LEVELS) - 1:
                    new_level = LEVELS[current_idx + 1]
                    mastery = 0  # Reset mastery counter for new level
                    feedback += f" 🎉 Fantastic progress! You've unlocked Level {new_level}!"
        else:
            mistake_count += 1
            streak = 0
            mastery = max(0, mastery - 1)
            hint = lesson.get("hint", "Try thinking about it once more!")
            
            if mistake_count >= 2:
                remedial_needed = True
                feedback = f"That's okay! Learning takes practice. Hint: {hint} Let's try together!"
            else:
                feedback = f"Almost there! {hint}"

        updated_progress = {
            "mastery": mastery,
            "level": new_level,
            "streak": streak,
            "completed_lessons": completed_lessons,
            "mistake_count": mistake_count,
            "threshold": self.threshold
        }

        return {
            "correct": is_correct,
            "hint": hint,
            "feedback": feedback,
            "mastery": mastery,
            "next_level": new_level,
            "progress": updated_progress,
            "remedial_needed": remedial_needed
        }


learning_service = LearningService()
