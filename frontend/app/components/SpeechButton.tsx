"use client";

import React, { useState, useEffect } from "react";

interface SpeechProps {
  textToRead: string;
}

/**
 * Strips emoji characters, special symbols, and excess whitespace so that
 * the speech engine only pronounces words without reading emoji names aloud.
 */
function cleanTextForSpeech(text: string): string {
  return text
    // Remove emojis and pictographs
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji}\uFE0F]/gu, "")
    // Remove extra punctuation clusters or dangling dashes
    .replace(/[\*\_~#]/g, "")
    // Clean up multiple spaces
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

        // Prioritize friendly, natural English female voices available on Windows, Mac, iOS, Android, and Chrome
        const femaleVoiceNames = [
          "zira", // Windows Microsoft Zira Desktop
          "jenny", // Microsoft Jenny Online (Natural)
          "aria", // Microsoft Aria Online
          "samantha", // macOS / iOS Samantha
          "karen", // macOS Karen
          "victoria", // macOS Victoria
          "google us english", // Chrome female voice
          "female",
        ];

        // 1. Try to find an English voice matching our preferred female names
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

        // 2. Fallback to any English voice
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

    // Clean emojis from the utterance text
    const spokenText = cleanTextForSpeech(textToRead);
    if (!spokenText) return;

    const utterance = new SpeechSynthesisUtterance(spokenText);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Calibrate rate and pitch for a warm, gentle female teacher tone
    utterance.rate = 0.88; // gentle, steady pace suitable for kids under 7
    utterance.pitch = 1.2; // warm, cheerful, higher-pitch tone

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
      className={`p-1.5 rounded-full transition text-xs flex items-center justify-center ${
        isSpeaking
          ? "bg-rose-100 text-rose-700 animate-pulse"
          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
      }`}
    >
      {isSpeaking ? "⏹️" : "🔊"}
    </button>
  );
};
