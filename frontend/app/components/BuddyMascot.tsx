"use client";

import React from "react";

interface MascotProps {
  mood?: "happy" | "thinking" | "support" | "excited";
  size?: number;
}

export const BuddyMascot: React.FC<MascotProps> = ({ mood = "happy", size = 80 }) => {
  return (
    <div
      className="relative flex items-center justify-center select-none animate-float-slow cursor-pointer"
      style={{ width: size, height: size }}
      aria-label="Buddy the English Learning Mascot"
    >
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md -z-10" />

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        {/* Soft Ears */}
        <circle cx="28" cy="28" r="14" fill="#FBBF24" />
        <circle cx="28" cy="28" r="8" fill="#FDE68A" />
        <circle cx="72" cy="28" r="14" fill="#FBBF24" />
        <circle cx="72" cy="28" r="8" fill="#FDE68A" />

        {/* Head / Body */}
        <circle cx="50" cy="54" r="36" fill="#F59E0B" />
        <ellipse cx="50" cy="58" rx="28" ry="24" fill="#FEF3C7" />

        {/* Cheeks */}
        <ellipse cx="32" cy="62" rx="5.5" ry="4" fill="#FB7185" opacity="0.75" />
        <ellipse cx="68" cy="62" rx="5.5" ry="4" fill="#FB7185" opacity="0.75" />

        {/* Dynamic Eyes */}
        {mood === "thinking" ? (
          <>
            <circle cx="38" cy="48" r="4.5" fill="#1E293B" />
            <circle cx="62" cy="44" r="4.5" fill="#1E293B" />
            <circle cx="64" cy="42" r="1.5" fill="#FFFFFF" />
          </>
        ) : mood === "excited" ? (
          <>
            {/* Happy curved eyes ^ ^ */}
            <path d="M33 50 C35 43, 41 43, 43 50" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M57 50 C59 43, 65 43, 67 50" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="38" cy="48" r="5" fill="#1E293B" />
            <circle cx="39.5" cy="46" r="2" fill="#FFFFFF" />
            <circle cx="62" cy="48" r="5" fill="#1E293B" />
            <circle cx="63.5" cy="46" r="2" fill="#FFFFFF" />
          </>
        )}

        {/* Cute Nose */}
        <polygon points="47,54 53,54 50,58" fill="#92400E" rx="1" />

        {/* Mouth */}
        {mood === "support" ? (
          <path d="M44 65 Q50 68 56 65" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : mood === "excited" ? (
          <path d="M42 62 Q50 74 58 62 Z" fill="#EF4444" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
        ) : (
          <path d="M43 62 Q50 69 57 62" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        )}
      </svg>
    </div>
  );
};
