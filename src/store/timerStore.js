import { create } from 'zustand';
import 'react-native-get-random-values'; // Initialize the polyfill
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library

export const useTimerStore = create((set, get) => ({
  timers: [],
  history: [],

  addTimer: (timer) => {
    const newTimer = {
      id: uuidv4(), // Generates a valid UUID
      status: 'idle',
      remainingTime: timer.duration,
      createdAt: Date.now(),
      ...timer,
    };

    set((state) => ({
      timers: [...state.timers, newTimer],
    }));
  },

  startTimer: (id) => {
    set((state) => ({
      timers: state.timers.map((timer) =>
        timer.id === id ? { ...timer, status: 'running' } : timer
      ),
    }));
  },

  pauseTimer: (id) => {
    set((state) => ({
      timers: state.timers.map((timer) =>
        timer.id === id ? { ...timer, status: 'paused' } : timer
      ),
    }));
  },

  resetTimer: (id) => {
    set((state) => ({
      timers: state.timers.map((timer) =>
        timer.id === id
          ? { ...timer, status: 'idle', remainingTime: timer.duration }
          : timer
      ),
    }));
  },

  startCategoryTimers: (category) => {
    set((state) => ({
      timers: state.timers.map((timer) =>
        timer.category === category && timer.status !== 'completed'
          ? { ...timer, status: 'running' }
          : timer
      ),
    }));
  },

  pauseCategoryTimers: (category) => {
    set((state) => ({
      timers: state.timers.map((timer) =>
        timer.category === category && timer.status === 'running'
          ? { ...timer, status: 'paused' }
          : timer
      ),
    }));
  },

  resetCategoryTimers: (category) => {
    set((state) => ({
      timers: state.timers.map((timer) =>
        timer.category === category
          ? { ...timer, status: 'idle', remainingTime: timer.duration }
          : timer
      ),
    }));
  },

  updateTimer: (id) => {
    const { timers } = get();
    const timer = timers.find((t) => t.id === id);

    if (timer && timer.status === 'running' && timer.remainingTime > 0) {
      set((state) => ({
        timers: state.timers.map((t) =>
          t.id === id
            ? {
                ...t,
                remainingTime: t.remainingTime - 1,
                status: t.remainingTime === 1 ? 'completed' : 'running',
              }
            : t
        ),
      }));
    }
  },

  completeTimer: (id) => {
    const { timers } = get();
    const timer = timers.find((t) => t.id === id);

    if (timer) {
      const historyEntry = {
        id: timer.id,
        name: timer.name,
        category: timer.category,
        duration: timer.duration,
        completedAt: Date.now(),
      };

      set((state) => ({
        history: [...state.history, historyEntry],
        timers: state.timers.map((t) =>
          t.id === id ? { ...t, status: 'completed', completedAt: Date.now() } : t
        ),
      }));
    }
  },
}));
