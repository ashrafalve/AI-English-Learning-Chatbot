"use client";

import React, { useState } from "react";
import { Lesson, LearnerState } from "../lib/api";

interface ActivityPanelProps {
  currentLesson: Lesson | null;
  learnerState: LearnerState;
  onSelectOption: (optionText: string) => void;
  onRequestHint: () => void;
  onNextLesson?: () => void;
  lastFeedback?: string | null;
  lastHint?: string | null;
  isCorrect?: boolean | null;
  isLoading?: boolean;
}

export const LearningActivityPanel: React.FC<ActivityPanelProps> = ({
  currentLesson,
  learnerState,
  onSelectOption,
  onRequestHint,
  onNextLesson,
  lastFeedback,
  lastHint,
  isCorrect,
  isLoading,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!currentLesson) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border-2 border-dashed border-sky-200/80 text-center flex flex-col items-center justify-center min-h-[240px] shadow-sm">
        <div className="text-5xl mb-3 animate-bounce-subtle">🎈</div>
        <h3 className="text-lg font-extrabold text-sky-800">Select an English Lesson</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
          Click any lesson card on the left to start exploring colorful words, animal friends, and stories!
        </p>
      </div>
    );
  }

  // Topic icon mapping for visual child delight
  const topicIcons: Record<string, string> = {
    colors: "🎨",
    animals: "🐾",
    alphabet: "🔤",
    numbers: "🔢",
    nature: "🌱",
    sentences: "💬",
    verbs: "🏃",
    questions: "❓",
    grammar: "📚",
    storytelling: "📖",
    comprehension: "🧠",
    conversation: "🤝",
  };

  const currentTopicIcon = topicIcons[currentLesson.topic.toLowerCase()] || "✨";

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-amber-100 flex flex-col gap-5 transition-all">
      {/* Lesson Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentTopicIcon}</span>
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/70 rounded-full text-xs font-extrabold uppercase tracking-wider">
            {currentLesson.topic}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          <span>Level</span>
          <span className="px-1.5 py-0.2 bg-sky-600 text-white rounded-md text-[10px]">
            {currentLesson.level}
          </span>
        </div>
      </div>

      {/* Main Question Display */}
      <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-yellow-50/60 rounded-2xl p-5 border border-amber-200/60 relative overflow-hidden shadow-xs">
        <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-extrabold uppercase tracking-wider mb-2">
          <span>⭐ Lesson Activity</span>
        </div>
        <h2 className="text-lg md:text-xl font-extrabold text-slate-800 leading-snug">
          {currentLesson.question}
        </h2>
      </div>

      {/* Multiple Choice Answers if available */}
      {currentLesson.options && currentLesson.options.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600 flex items-center gap-1">
              <span>👉</span> Tap an answer:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {currentLesson.options.map((opt, i) => (
              <button
                key={i}
                disabled={isLoading}
                onClick={() => onSelectOption(opt)}
                className="py-3.5 px-4 text-center rounded-2xl font-bold text-slate-700 bg-gradient-to-b from-white to-sky-50/60 hover:from-sky-50 hover:to-sky-100/90 active:scale-95 transition-all duration-150 border-2 border-sky-200/80 hover:border-sky-400 shadow-xs text-sm disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className="group-hover:scale-105 inline-block transition-transform">
                  {opt}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action / Hint Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <button
          onClick={onRequestHint}
          className="text-xs font-extrabold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 py-2 px-3.5 rounded-full bg-amber-50 hover:bg-amber-100/80 border border-amber-200/70 transition-transform active:scale-95 shadow-xs"
        >
          <span>💡</span>
          <span>Need a Hint?</span>
        </button>

        {currentLesson.explanation && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 py-1.5 px-3 rounded-full hover:bg-sky-50 transition"
          >
            <span>{showExplanation ? "🙈 Hide reason" : "🔍 Why is this?"}</span>
          </button>
        )}
      </div>

      {/* Hint Alert */}
      {lastHint && (
        <div className="bg-amber-50/90 border-2 border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5 animate-pop-in">
          <span className="text-lg">💡</span>
          <div className="leading-relaxed">
            <span className="font-extrabold">Buddy's Hint: </span>
            {lastHint}
          </div>
        </div>
      )}

      {/* Explanation Banner */}
      {showExplanation && (
        <div className="bg-sky-50/90 border border-sky-200 rounded-2xl p-3.5 text-xs text-sky-950 animate-pop-in">
          <span className="font-extrabold">🌟 Did You Know? </span>
          {currentLesson.explanation}
        </div>
      )}

      {/* Success Banner */}
      {isCorrect && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900 shadow-xs animate-pop-in">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce-subtle">🌟</span>
            <div>
              <div className="font-black text-sm text-emerald-800">Super Job!</div>
              <div className="text-[11px] text-emerald-700">You mastered this answer!</div>
            </div>
          </div>
          {onNextLesson && (
            <button
              onClick={onNextLesson}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-black text-xs hover:from-emerald-500 hover:to-teal-500 shadow-sm active:scale-95 transition-all"
            >
              Next Lesson 🚀
            </button>
          )}
        </div>
      )}
    </div>
  );
};
