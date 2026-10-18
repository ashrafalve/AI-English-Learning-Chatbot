"use client";

import React, { useState, useEffect } from "react";
import { LearnerState } from "../lib/api";

const STORAGE_KEY = "brimsel_learner_state_v1";

const DEFAULT_STATE: LearnerState = {
  current_level: "L1",
  current_lesson_id: null,
  mastery: 0,
  streak: 0,
  mistake_count: 0,
  completed_lessons: [],
};

export function useLearnerState() {
  const [state, setState] = useState<LearnerState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState({
          current_level: parsed.current_level || "L1",
          current_lesson_id: parsed.current_lesson_id || null,
          mastery: Number(parsed.mastery) || 0,
          streak: Number(parsed.streak) || 0,
          mistake_count: Number(parsed.mistake_count) || 0,
          completed_lessons: Array.isArray(parsed.completed_lessons) ? parsed.completed_lessons : [],
        });
      }
    } catch (e) {
      console.warn("Could not read learner state from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateState = (partial: Partial<LearnerState>) => {
    setState((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }
      return updated;
    });
  };

  const resetState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Could not clear localStorage", e);
    }
    setState(DEFAULT_STATE);
  };

  return { state, updateState, resetState, isLoaded };
}
