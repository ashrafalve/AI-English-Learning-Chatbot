"use client";

import React, { useState, useEffect, useRef } from "react";
import { apiClient, Lesson, ChatResponsePayload } from "./lib/api";
import { useLearnerState } from "./hooks/useLearnerState";
import { BuddyMascot } from "./components/BuddyMascot";
import { LearningActivityPanel } from "./components/LearningActivityPanel";
import { SpeechButton } from "./components/SpeechButton";
import { StickerBadge } from "./components/StickerBadge";
import { 
  Send, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Gamepad2, 
  HeartHandshake, 
  MessageCircle, 
  Loader2,
  CheckCircle2
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  mode?: string;
  hint?: string | null;
  timestamp: string;
}

export default function Home() {
  const { state: learnerState, updateState, resetState, isLoaded } = useLearnerState();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<string>("LEARNING");
  const [lastHint, setLastHint] = useState<string | null>(null);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [mascotMood, setMascotMood] = useState<"happy" | "thinking" | "support" | "excited">("happy");
  const [showResetModal, setShowResetModal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (!isLoaded) return;
    loadLessons(learnerState.current_level);
  }, [learnerState.current_level, isLoaded]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "bot",
          text: "Hi there, little star! ⭐ I'm Buddy, your English learning pal. What fun things shall we explore today?",
          mode: "LEARNING",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, []);

  async function loadLessons(lvl: string) {
    try {
      setApiError(null);
      const res = await apiClient.getLessons(lvl);
      setLessons(res.lessons || []);

      if (!currentLesson && res.lessons && res.lessons.length > 0) {
        setCurrentLesson(res.lessons[0]);
      } else if (currentLesson && currentLesson.level !== lvl) {
        const found = res.lessons.find((l) => l.id === learnerState.current_lesson_id) || res.lessons[0];
        setCurrentLesson(found || null);
      }
    } catch (err: any) {
      console.error("Error loading lessons:", err);
      setApiError("Could not connect to Buddy's backend. Check if the server is running!");
    }
  }

  async function sendMessage(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setInput("");
    setApiError(null);
    setLoading(true);
    setMascotMood("thinking");

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const payload = {
        message: text,
        current_level: learnerState.current_level,
        current_lesson_id: currentLesson ? currentLesson.id : null,
        learner_state: learnerState,
        recent_history: messages.slice(-4).map((m) => ({ role: m.role, text: m.text })),
      };

      const response: ChatResponsePayload = await apiClient.sendChat(payload);

      setActiveMode(response.mode);
      setLastHint(response.hint || null);
      setLastFeedback(response.feedback);
      setLastCorrect(response.answer_correct ?? null);

      if (response.answer_correct) {
        setMascotMood("excited");
      } else if (response.mode === "SUPPORT") {
        setMascotMood("support");
      } else {
        setMascotMood("happy");
      }

      if (response.progress) {
        updateState({
          mastery: Number(response.progress.mastery) || 0,
          current_level: response.progress.level || response.current_level || learnerState.current_level,
          streak: Number(response.progress.streak) || 0,
          mistake_count: Number(response.progress.mistake_count) || 0,
          completed_lessons: Array.isArray(response.progress.completed_lessons)
            ? response.progress.completed_lessons
            : learnerState.completed_lessons,
        });
      }

      const botMsg: ChatMessage = {
        id: response.request_id || String(Date.now() + 1),
        role: "bot",
        text: response.reply,
        mode: response.mode,
        hint: response.hint,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMascotMood("support");
      setApiError("Oops, Buddy had a little hiccup reaching the server. Please try again!");
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "bot",
          text: "I'm having a little trouble connecting right now. Can we try that again in a second? 🎈",
          mode: "SUPPORT",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectLesson(lesson: Lesson) {
    setCurrentLesson(lesson);
    setLastHint(null);
    setLastCorrect(null);
    updateState({ current_lesson_id: lesson.id });

    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        role: "bot",
        text: `Let's practice: "${lesson.question}"`,
        mode: "LEARNING",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }

  function handleNextLesson() {
    if (!lessons || lessons.length === 0) return;
    const currentIndex = lessons.findIndex((l) => l.id === currentLesson?.id);
    const nextLesson = lessons[(currentIndex + 1) % lessons.length];
    handleSelectLesson(nextLesson);
  }

  function handleRequestHint() {
    if (currentLesson?.hint) {
      setLastHint(currentLesson.hint);
      sendMessage("Can I have a hint please?");
    }
  }

  const levels = [
    { id: "L1", title: "Beginner", sticker: "seedling" },
    { id: "L2", title: "Elementary", sticker: "rocket" },
    { id: "L3", title: "Storyteller", sticker: "crown" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 flex flex-col font-sans selection:bg-amber-100">
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-amber-100/90 sticky top-0 z-30 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BuddyMascot mood={mascotMood} size={52} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-sky-700 via-sky-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
                  BRIMSEL Buddy
                </h1>
                <span className="text-[11px] px-2.5 py-0.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 font-extrabold rounded-full border border-amber-200/60 shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Age &lt; 7 English</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Your gentle, cheerful English learning companion
              </p>
            </div>
          </div>

          {/* Header Stats Bar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 bg-gradient-to-r from-amber-50 to-orange-50/60 px-3.5 py-1.5 rounded-2xl border border-amber-200/70 shadow-xs">
              <span className="text-xs font-black text-amber-800">Stage:</span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-black text-xs shadow-xs">
                {learnerState.current_level}
              </span>
              <span className="text-xs font-bold text-slate-600 ml-1 flex items-center gap-1.5">
                <StickerBadge name="star" size="sm" />
                <span>{learnerState.mastery}/3 Stars</span>
              </span>
              {learnerState.streak > 0 && (
                <span className="text-xs font-bold text-orange-600 ml-1 flex items-center gap-1.5">
                  <StickerBadge name="flame" size="sm" />
                  <span>{learnerState.streak} Streak</span>
                </span>
              )}
            </div>

            <button
              onClick={() => setShowResetModal(true)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition active:scale-95 flex items-center gap-1.5"
              title="Reset Learning Progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Connection / API Error Banner */}
      {apiError && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 text-center text-xs text-rose-700 font-bold flex items-center justify-center gap-2">
          <span>⚠️ {apiError}</span>
          <button
            onClick={() => loadLessons(learnerState.current_level)}
            className="underline hover:text-rose-900"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Main Learning Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Levels & Lessons Navigation */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          {/* Level Switcher Card */}
          <div className="bg-white rounded-3xl p-4 md:p-5 shadow-xs border border-amber-100">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Choose Your Level</span>
              <span className="text-amber-500 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> 100% Free
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {levels.map((lvl) => {
                const isActive = learnerState.current_level === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => updateState({ current_level: lvl.id })}
                    className={`py-3 px-2 rounded-2xl text-xs font-black transition-all flex flex-col items-center gap-1.5 border-2 relative overflow-hidden ${
                      isActive
                        ? "bg-gradient-to-b from-sky-600 to-sky-700 text-white border-sky-600 shadow-md scale-[1.02]"
                        : "bg-slate-50/80 text-slate-700 border-slate-200/80 hover:bg-sky-50/70 hover:border-sky-300"
                    }`}
                  >
                    <StickerBadge name={lvl.sticker} size="md" />
                    <span className="text-xs font-black">{lvl.id}</span>
                    <span className="text-[10px] font-medium opacity-85">
                      {lvl.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lessons List Card */}
          <div className="bg-white rounded-3xl p-4 md:p-5 shadow-xs border border-amber-100 flex-1 flex flex-col max-h-[380px] lg:max-h-[520px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                {learnerState.current_level} Lesson Quests
              </span>
              <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{learnerState.completed_lessons.length} Finished</span>
              </span>
            </div>

            <div className="overflow-y-auto flex-1 flex flex-col gap-2.5 pr-1.5">
              {lessons.map((lesson) => {
                const isSelected = currentLesson?.id === lesson.id;
                const isDone = learnerState.completed_lessons.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson)}
                    className={`text-left p-3.5 rounded-2xl text-xs font-bold transition-all duration-150 flex items-center justify-between border-2 ${
                      isSelected
                        ? "bg-amber-50/90 border-amber-400 text-amber-950 shadow-sm scale-[1.01]"
                        : "bg-slate-50/60 border-slate-200/80 text-slate-700 hover:bg-amber-50/50 hover:border-amber-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="shrink-0">
                        {isDone ? (
                          <StickerBadge name="star" size="sm" />
                        ) : (
                          <StickerBadge name="grammar" size="sm" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="truncate font-extrabold text-slate-800">
                          {lesson.question}
                        </div>
                        <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mt-0.5">
                          {lesson.topic}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 bg-amber-200/80 text-amber-900 rounded-md text-[10px] font-black whitespace-nowrap ml-2">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Area: Interactive Activity & Rich Conversational Chat */}
        <section className="lg:col-span-8 flex flex-col gap-5">
          {/* Active Lesson Interactive Panel */}
          <LearningActivityPanel
            currentLesson={currentLesson}
            learnerState={learnerState}
            onSelectOption={(opt) => sendMessage(opt)}
            onRequestHint={handleRequestHint}
            onNextLesson={handleNextLesson}
            lastFeedback={lastFeedback}
            lastHint={lastHint}
            isCorrect={lastCorrect}
            isLoading={loading}
          />

          {/* Chat Container */}
          <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xs border border-amber-100 flex-1 flex flex-col min-h-[420px] max-h-[540px]">
            {/* Mode Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">Companion Mode:</span>
                <span
                  className={`px-3 py-1 rounded-full font-black text-[11px] shadow-xs border flex items-center gap-1.5 ${
                    activeMode === "LEARNING"
                      ? "bg-sky-50 text-sky-800 border-sky-200"
                      : activeMode === "SUPPORT"
                      ? "bg-pink-50 text-pink-800 border-pink-200"
                      : activeMode === "ENGAGEMENT"
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}
                >
                  {activeMode === "LEARNING" && (
                    <>
                      <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                      <span>Learning</span>
                    </>
                  )}
                  {activeMode === "SUPPORT" && (
                    <>
                      <HeartHandshake className="w-3.5 h-3.5 text-pink-600" />
                      <span>Gentle Support</span>
                    </>
                  )}
                  {activeMode === "ENGAGEMENT" && (
                    <>
                      <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Play & Games</span>
                    </>
                  )}
                  {activeMode === "CONVERSATION" && (
                    <>
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Chat & Stories</span>
                    </>
                  )}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Child-safe zone</span>
              </span>
            </div>

            {/* Conversation Messages Area */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3.5 pr-2">
              {messages.map((m) => {
                const isBot = m.role === "bot";
                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2.5 animate-pop-in ${
                      isBot ? "self-start" : "self-end flex-row-reverse"
                    }`}
                  >
                    {isBot && (
                      <div className="shrink-0 mb-1">
                        <BuddyMascot mood={mascotMood} size={36} />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl text-sm leading-relaxed shadow-xs flex flex-col gap-1.5 transition-all ${
                        isBot
                          ? m.mode === "SUPPORT"
                            ? "bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200/80 text-slate-800 rounded-bl-xs"
                            : "bg-gradient-to-br from-[#F5F9FE] to-sky-50/70 border-2 border-sky-100 text-slate-800 rounded-bl-xs"
                          : "bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-br-xs font-semibold shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-black tracking-wide uppercase opacity-75">
                          {isBot ? "Buddy" : "You"}
                        </span>
                        {isBot && <SpeechButton textToRead={m.text} />}
                      </div>

                      <p className="font-semibold text-slate-800 dark:text-inherit">
                        {m.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="self-start flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 py-2 px-3.5 rounded-2xl border border-slate-200/60 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-600" /> Buddy is thinking...
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Suggested Quick Replies Pills with Stickers */}
            <div className="flex items-center gap-2 overflow-x-auto py-2.5 mt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 font-black uppercase tracking-wider whitespace-nowrap">
                Quick taps:
              </span>
              <button
                onClick={() => sendMessage("Let's play a game!")}
                className="text-xs px-3.5 py-1.5 bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 text-purple-900 border border-purple-200/80 rounded-full font-black whitespace-nowrap transition-transform active:scale-95 shadow-xs flex items-center gap-2"
              >
                <StickerBadge name="game" size="sm" />
                <span>Play a game!</span>
              </button>
              <button
                onClick={() => sendMessage("What is a tiger?")}
                className="text-xs px-3.5 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-orange-200/80 rounded-full font-black whitespace-nowrap transition-transform active:scale-95 shadow-xs flex items-center gap-2"
              >
                <StickerBadge name="animals" size="sm" />
                <span>Ask about animals</span>
              </button>
              <button
                onClick={() => sendMessage("I don't understand")}
                className="text-xs px-3.5 py-1.5 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 text-pink-900 border border-pink-200/80 rounded-full font-black whitespace-nowrap transition-transform active:scale-95 shadow-xs flex items-center gap-2"
              >
                <StickerBadge name="hint" size="sm" />
                <span>I need a hint</span>
              </button>
            </div>

            {/* Message Input Box */}
            <div className="mt-1 flex items-center gap-2">
              <input
                type="text"
                value={input}
                maxLength={400}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your answer or say hello..."
                className="flex-1 bg-slate-50/80 border-2 border-slate-200/80 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white transition text-slate-800 placeholder-slate-400 shadow-inner"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 active:scale-95 text-white font-black px-6 py-3.5 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md text-sm flex items-center gap-2"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-pop-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center flex flex-col gap-4">
            <div className="flex justify-center">
              <StickerBadge name="hint" size="xl" className="animate-bounce-subtle" />
            </div>
            <h3 className="text-lg font-black text-slate-800">Reset Learning Progress?</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              This will clear completed lessons and return your score back to Level 1.
            </p>
            <div className="flex gap-2.5 justify-center mt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetState();
                  setShowResetModal(false);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-xl text-xs font-black hover:from-rose-500 hover:to-red-500 transition shadow-sm"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
