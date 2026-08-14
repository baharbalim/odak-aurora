import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Task } from "../interfaces/Pomodoro";

const STORAGE_KEY = "odak-aurora:gorevler";
const ACTIVE_KEY = "odak-aurora:aktif-gorev";

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, []);
  const [activeTaskId, setActiveTaskId] = useLocalStorage<string | null>(ACTIVE_KEY, null);

  const addTask = useCallback(
    (title: string, targetPomodoros = 1) => {
      const task: Task = {
        id: crypto.randomUUID(),
        title,
        pomodoroCount: 0,
        targetPomodoros,
        done: false,
        createdAt: Date.now(),
      };
      setTasks((prev) => [...prev, task]);
      setActiveTaskId((prev) => prev ?? task.id);
    },
    [setTasks, setActiveTaskId]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setActiveTaskId((prev) => (prev === id ? null : prev));
    },
    [setTasks, setActiveTaskId]
  );

  const toggleDone = useCallback(
    (id: string) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    },
    [setTasks]
  );

  const incrementPomodoro = useCallback(
    (id: string | null) => {
      if (!id) return;
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, pomodoroCount: t.pomodoroCount + 1 } : t)));
    },
    [setTasks]
  );

  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? null;

  return { tasks, activeTask, activeTaskId, setActiveTaskId, addTask, deleteTask, toggleDone, incrementPomodoro };
}
