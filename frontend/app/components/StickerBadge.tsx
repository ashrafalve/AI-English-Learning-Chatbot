"use client";

import React from "react";
import { 
  Sprout, 
  Rocket, 
  Crown, 
  Palette, 
  Dog, 
  Type, 
  Binary, 
  Sun, 
  MessageSquare, 
  BookOpen, 
  Lightbulb, 
  Heart, 
  Trophy, 
  Flame, 
  Sparkles, 
  Gamepad2, 
  HelpCircle,
  Award,
  Zap,
  Smile
} from "lucide-react";

export type StickerName = 
  | "seedling" 
  | "rocket" 
  | "crown" 
  | "palette" 
  | "animals" 
  | "alphabet" 
  | "numbers" 
  | "nature" 
  | "sentences" 
  | "verbs" 
  | "questions" 
  | "grammar" 
  | "storytelling" 
  | "comprehension" 
  | "conversation" 
  | "trophy" 
  | "flame" 
  | "sparkles" 
  | "game" 
  | "hint" 
  | "star" 
  | "party";

interface StickerConfig {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  bgGradient: string;
  borderColor: string;
  iconColor: string;
  shadowColor: string;
}

const STICKER_CONFIG: Record<StickerName, StickerConfig> = {
  seedling: {
    icon: Sprout,
    bgGradient: "from-emerald-400 to-green-500",
    borderColor: "border-emerald-200",
    iconColor: "text-white",
    shadowColor: "shadow-emerald-500/20",
  },
  rocket: {
    icon: Rocket,
    bgGradient: "from-sky-400 to-blue-600",
    borderColor: "border-sky-200",
    iconColor: "text-white",
    shadowColor: "shadow-sky-500/20",
  },
  crown: {
    icon: Crown,
    bgGradient: "from-amber-400 to-yellow-500",
    borderColor: "border-amber-200",
    iconColor: "text-white",
    shadowColor: "shadow-amber-500/20",
  },
  palette: {
    icon: Palette,
    bgGradient: "from-fuchsia-400 to-purple-600",
    borderColor: "border-purple-200",
    iconColor: "text-white",
    shadowColor: "shadow-purple-500/20",
  },
  animals: {
    icon: Dog,
    bgGradient: "from-amber-400 to-orange-500",
    borderColor: "border-orange-200",
    iconColor: "text-white",
    shadowColor: "shadow-orange-500/20",
  },
  alphabet: {
    icon: Type,
    bgGradient: "from-teal-400 to-emerald-500",
    borderColor: "border-teal-200",
    iconColor: "text-white",
    shadowColor: "shadow-teal-500/20",
  },
  numbers: {
    icon: Binary,
    bgGradient: "from-indigo-400 to-blue-600",
    borderColor: "border-indigo-200",
    iconColor: "text-white",
    shadowColor: "shadow-indigo-500/20",
  },
  nature: {
    icon: Sun,
    bgGradient: "from-amber-300 to-yellow-500",
    borderColor: "border-yellow-200",
    iconColor: "text-white",
    shadowColor: "shadow-yellow-500/20",
  },
  sentences: {
    icon: MessageSquare,
    bgGradient: "from-blue-400 to-cyan-500",
    borderColor: "border-cyan-200",
    iconColor: "text-white",
    shadowColor: "shadow-cyan-500/20",
  },
  verbs: {
    icon: Zap,
    bgGradient: "from-rose-400 to-red-500",
    borderColor: "border-rose-200",
    iconColor: "text-white",
    shadowColor: "shadow-rose-500/20",
  },
  questions: {
    icon: HelpCircle,
    bgGradient: "from-violet-400 to-purple-600",
    borderColor: "border-purple-200",
    iconColor: "text-white",
    shadowColor: "shadow-purple-500/20",
  },
  grammar: {
    icon: BookOpen,
    bgGradient: "from-blue-500 to-indigo-600",
    borderColor: "border-blue-200",
    iconColor: "text-white",
    shadowColor: "shadow-blue-500/20",
  },
  storytelling: {
    icon: Sparkles,
    bgGradient: "from-pink-400 to-rose-500",
    borderColor: "border-pink-200",
    iconColor: "text-white",
    shadowColor: "shadow-pink-500/20",
  },
  comprehension: {
    icon: Lightbulb,
    bgGradient: "from-amber-400 to-orange-500",
    borderColor: "border-amber-200",
    iconColor: "text-white",
    shadowColor: "shadow-amber-500/20",
  },
  conversation: {
    icon: Heart,
    bgGradient: "from-rose-400 to-pink-500",
    borderColor: "border-rose-200",
    iconColor: "text-white",
    shadowColor: "shadow-rose-500/20",
  },
  trophy: {
    icon: Trophy,
    bgGradient: "from-amber-400 to-yellow-500",
    borderColor: "border-amber-200",
    iconColor: "text-white",
    shadowColor: "shadow-amber-500/20",
  },
  flame: {
    icon: Flame,
    bgGradient: "from-orange-500 to-red-600",
    borderColor: "border-orange-200",
    iconColor: "text-white",
    shadowColor: "shadow-orange-500/20",
  },
  sparkles: {
    icon: Sparkles,
    bgGradient: "from-amber-400 to-yellow-400",
    borderColor: "border-yellow-200",
    iconColor: "text-white",
    shadowColor: "shadow-yellow-500/20",
  },
  game: {
    icon: Gamepad2,
    bgGradient: "from-violet-500 to-indigo-600",
    borderColor: "border-violet-200",
    iconColor: "text-white",
    shadowColor: "shadow-violet-500/20",
  },
  hint: {
    icon: Lightbulb,
    bgGradient: "from-amber-300 to-orange-400",
    borderColor: "border-amber-200",
    iconColor: "text-white",
    shadowColor: "shadow-amber-500/20",
  },
  star: {
    icon: Award,
    bgGradient: "from-yellow-400 to-amber-500",
    borderColor: "border-yellow-200",
    iconColor: "text-white",
    shadowColor: "shadow-yellow-500/20",
  },
  party: {
    icon: Smile,
    bgGradient: "from-emerald-400 to-teal-500",
    borderColor: "border-emerald-200",
    iconColor: "text-white",
    shadowColor: "shadow-emerald-500/20",
  },
};

interface StickerBadgeProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const StickerBadge: React.FC<StickerBadgeProps> = ({
  name,
  size = "md",
  className = "",
}) => {
  const normalizedKey = (name.toLowerCase() in STICKER_CONFIG
    ? name.toLowerCase()
    : "sparkles") as StickerName;

  const config = STICKER_CONFIG[normalizedKey];
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "w-6 h-6 p-1 rounded-lg border",
    md: "w-9 h-9 p-1.5 rounded-xl border-2",
    lg: "w-12 h-12 p-2 rounded-2xl border-2",
    xl: "w-16 h-16 p-3 rounded-3xl border-3",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-7 h-7",
    xl: "w-9 h-9",
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center bg-gradient-to-br ${config.bgGradient} ${config.borderColor} shadow-md ${config.shadowColor} select-none transition-transform duration-200 hover:scale-105 active:scale-95 ${sizeClasses[size]} ${className}`}
      style={{
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.6)",
      }}
    >
      {/* Glossy Sticker Top Highlight */}
      <div className="absolute inset-x-1 top-0.5 h-1/3 bg-white/35 rounded-t-lg pointer-events-none" />

      {/* Center crisp icon */}
      <IconComponent className={`${config.iconColor} ${iconSizes[size]} drop-shadow-xs`} />
    </div>
  );
};
