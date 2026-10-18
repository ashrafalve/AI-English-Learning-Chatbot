export interface Lesson {
  id: string;
  level: "L1" | "L2" | "L3";
  topic: string;
  question: string;
  options?: string[];
  hint: string;
  explanation: string;
  feedback: string;
}

export interface LearnerState {
  current_level: string;
  current_lesson_id?: string | null;
  mastery: number;
  streak: number;
  mistake_count: number;
  completed_lessons: string[];
}

export interface ChatRequestPayload {
  message: string;
  current_level: string;
  current_lesson_id?: string | null;
  learner_state?: LearnerState;
  recent_history?: Array<{ role: string; text: string }>;
}

export interface ChatResponsePayload {
  reply: string;
  mode: "LEARNING" | "CONVERSATION" | "ENGAGEMENT" | "SUPPORT";
  detected_intent: string;
  detected_emotion_signal: string;
  current_level: string;
  lesson_id?: string | null;
  answer_correct?: boolean | null;
  hint?: string | null;
  feedback: string;
  progress: Record<string, any>;
  next_suggestion: string;
  response_source: string;
  request_id: string;
}

export interface ProgressEvalPayload {
  lesson_id: string;
  level: string;
  answer: string;
  progress: Record<string, any>;
}

export interface ProgressEvalResponse {
  correct: boolean;
  hint?: string | null;
  feedback: string;
  mastery: number;
  next_level: string;
  progress: Record<string, any>;
  remedial_needed?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export const apiClient = {
  async getHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error("Health check failed");
    return res.json();
  },

  async getLessons(level: string): Promise<{ level: string; lessons: Lesson[] }> {
    const res = await fetch(`${API_BASE_URL}/api/lessons?level=${encodeURIComponent(level)}`);
    if (!res.ok) throw new Error(`Failed to fetch lessons for level ${level}`);
    return res.json();
  },

  async sendChat(payload: ChatRequestPayload): Promise<ChatResponsePayload> {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Chat API error (${res.status}): ${err}`);
    }
    return res.json();
  },

  async evaluateProgress(payload: ProgressEvalPayload): Promise<ProgressEvalResponse> {
    const res = await fetch(`${API_BASE_URL}/api/progress/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Evaluation error");
    return res.json();
  },
};
