"use client";

import React, { useState } from "react";
import { Lesson, LearnerState } from "../lib/api";
import { StickerBadge } from "./StickerBadge";
import { Lightbulb, HelpCircle, EyeOff, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

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
      <div className="bg-white/90 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-8 border-2 border-dashed border-sky-200/80 text-center flex flex-col items-center justify-center min-h-[190px] md:min-h-[240px] shadow-xs w-full max-w-full">
        <div className="mb-2 md:mb-3 animate-bounce-subtle">
          <StickerBadge name="seedling" size="lg" />
        </div>
        <h3 className="text-base md:text-lg font-extrabold text-sky-800">Select an English Quest</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
          Choose any lesson above or from the quests list to start exploring words and stories!
        </p>
      </div>
    );
  }

  const topicStickerMap: Record<string, string> = {
    colors: "palette",
    animals: "animals",
    alphabet: "alphabet",
    numbers: "numbers",
    nature: "nature",
    sentences: "sentences",
    verbs: "verbs",
    questions: "questions",
    grammar: "grammar",
    storytelling: "storytelling",
    comprehension: "comprehension",
    conversation: "conversation",
  };

  const currentTopicSticker = topicStickerMap[currentLesson.topic.toLowerCase()] || "sparkles";

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xs border border-amber-100/90 flex flex-col gap-3.5 md:gap-5 transition-all w-full max-w-full overflow-hidden">
      {/* Lesson Header Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <StickerBadge name={currentTopicSticker} size="sm" className="shrink-0" />
          <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full text-[11px] md:text-xs font-black uppercase tracking-wider truncate">
            {currentLesson.topic}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-black text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 shrink-0">
          <span>Level</span>
          <span className="px-1.5 py-0.2 bg-sky-600 text-white rounded-md text-[10px] font-black">
            {currentLesson.level}
          </span>
        </div>
      </div>

      {/* Main Question Display */}
      <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-yellow-50/60 rounded-xl md:rounded-2xl p-4 md:p-5 border border-amber-200/60 relative overflow-hidden shadow-xs w-full">
        <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-amber-800 font-black uppercase tracking-wider mb-1.5">
          <StickerBadge name="star" size="sm" />
          <span>Active Learning Quest</span>
        </div>
        <h2 className="text-base md:text-xl font-black text-slate-800 leading-snug break-words">
          {currentLesson.question}
        </h2>
      </div>

      {/* Multiple Choice Answers */}
      {currentLesson.options && currentLesson.options.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tap your answer:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
            {currentLesson.options.map((opt, i) => (
              <button
                key={i}
                disabled={isLoading}
                onClick={() => onSelectOption(opt)}
                className="py-3 px-3.5 text-center rounded-xl md:rounded-2xl font-bold text-slate-700 bg-gradient-to-b from-white to-sky-50/60 hover:from-sky-50 hover:to-sky-100/90 active:scale-95 transition-all border-2 border-sky-200/80 hover:border-sky-400 shadow-xs text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed group w-full truncate"
              >
                <span className="group-hover:scale-105 inline-block transition-transform truncate max-w-full">
                  {opt}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action / Hint Bar */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 gap-2">
        <button
          onClick={onRequestHint}
          className="text-[11px] md:text-xs font-black text-amber-800 hover:text-amber-900 flex items-center gap-1.5 py-1.5 md:py-2 px-3 md:px-3.5 rounded-full bg-amber-50 hover:bg-amber-100/80 border border-amber-200/70 transition-transform active:scale-95 shadow-xs shrink-0"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
          <span>Need a Hint?</span>
        </button>

        {currentLesson.explanation && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-[11px] md:text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 py-1 px-2.5 rounded-full hover:bg-sky-50 transition shrink-0"
          >
            {showExplanation ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hide reason</span>
              </>
            ) : (
              <>
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why is this?</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hint Alert */}
      {lastHint && (
        <div className="bg-amber-50/90 border-2 border-amber-200/80 rounded-xl md:rounded-2xl p-3 md:p-3.5 text-xs text-amber-900 flex items-start gap-2.5 animate-pop-in w-full break-words">
          <StickerBadge name="hint" size="sm" className="shrink-0 mt-0.5" />
          <div className="leading-relaxed min-w-0">
            <span className="font-black">Buddy's Hint: </span>
            {lastHint}
          </div>
        </div>
      )}

      {/* Explanation Banner */}
      {showExplanation && (
        <div className="bg-sky-50/90 border border-sky-200 rounded-xl md:rounded-2xl p-3 md:p-3.5 text-xs text-sky-950 animate-pop-in flex items-start gap-2.5 w-full break-words">
          <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="font-black">Did You Know? </span>
            {currentLesson.explanation}
          </div>
        </div>
      )}

      {/* Success Banner */}
      {isCorrect && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-xl md:rounded-2xl p-3.5 md:p-4 flex items-center justify-between text-xs text-emerald-900 shadow-xs animate-pop-in gap-2 w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <StickerBadge name="trophy" size="md" className="shrink-0 animate-bounce-subtle" />
            <div className="min-w-0">
              <div className="font-black text-xs md:text-sm text-emerald-800 flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" /> Super Job!
              </div>
              <div className="text-[10px] md:text-[11px] text-emerald-700 truncate">You mastered this answer!</div>
            </div>
          </div>
          {onNextLesson && (
            <button
              onClick={onNextLesson}
              className="px-3 md:px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-black text-[11px] md:text-xs hover:from-emerald-500 hover:to-teal-500 shadow-sm active:scale-95 transition-all flex items-center gap-1 shrink-0"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
