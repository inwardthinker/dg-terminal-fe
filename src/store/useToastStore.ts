"use client";

import { create } from "zustand";

export type ToastType = "success" | "error" | "warning" | "info";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration: number;
  createdAt: number;
};

export type ShowToastInput = {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
};

type ToastState = {
  toasts: Toast[];
  maxVisible: number;
  showToast: (input: ShowToastInput) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
};

const DEFAULT_DURATION = 3000;
const DEFAULT_MAX_VISIBLE = 5;

const createToastId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  maxVisible: DEFAULT_MAX_VISIBLE,
  showToast: ({ title, description, type = "info", duration = DEFAULT_DURATION }) => {
    const id = createToastId();
    const normalizedDuration =
      Number.isFinite(duration) && duration > 0 ? duration : DEFAULT_DURATION;

    const nextToast: Toast = {
      id,
      title,
      description,
      type,
      duration: normalizedDuration,
      createdAt: Date.now(),
    };

    const { maxVisible } = get();
    set((state) => ({
      toasts: [...state.toasts, nextToast].slice(-maxVisible),
    }));

    return id;
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clearAllToasts: () => set({ toasts: [] }),
}));
