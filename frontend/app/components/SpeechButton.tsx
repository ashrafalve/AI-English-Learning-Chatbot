"use client";

import React, { useState, useEffect } from "react";
import { Volume2, Square } from "lucide-react";

interface SpeechProps {
  textToRead: string;
}

function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji}\uFE0F]/gu, "")
    .replace(/[\*\_~#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const SpeechButton: React.FC<SpeechProps> = ({ textToRead }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true);

      const findWarmFemaleVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return;

        const femaleVoiceNames = [
          "zira",
          "jenny",
          "aria",
          "samantha",
          "karen",
          "victoria",
          "google us english",
          "female",
        ];

        const bestFemaleVoice = voices.find((v) => {
          const nameLower = v.name.toLowerCase();
          const langLower = v.lang.toLowerCase();
          const isEnglish = langLower.startsWith("en");
          return isEnglish && femaleVoiceNames.some((n) => nameLower.includes(n));
        });

        if (bestFemaleVoice) {
          setSelectedVoice(bestFemaleVoice);
          return;
        }

        const anyEnglishVoice = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
        if (anyEnglishVoice) {
          setSelectedVoice(anyEnglishVoice);
        }
      };

      findWarmFemaleVoice();
      window.speechSynthesis.onvoiceschanged = findWarmFemaleVoice;
    }
  }, []);

  const toggleSpeak = () => {
    if (!supported || !textToRead) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const spokenText = cleanTextForSpeech(textToRead);
    if (!spokenText) return;

    const utterance = new SpeechSynthesisUtterance(spokenText);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.88;
    utterance.pitch = 1.2;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (!supported) return null;

  return (
    <button
      onClick={toggleSpeak}
      title={isSpeaking ? "Stop listening" : "Listen aloud (Female voice)"}
      aria-label={isSpeaking ? "Stop speech" : "Read message aloud"}
      className={`p-1.5 rounded-full transition-all text-xs flex items-center justify-center active:scale-95 ${
        isSpeaking
          ? "bg-rose-100 text-rose-700 animate-pulse ring-2 ring-rose-300"
          : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
      }`}
    >
      {isSpeaking ? (
        <Square className="w-3.5 h-3.5 fill-current" />
      ) : (
        <Volume2 className="w-3.5 h-3.5" />
      )}
    </button>
  );
};
