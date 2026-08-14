import { Check, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Task } from "../interfaces/Pomodoro";

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  onSelect: (id: string) => void;
  onAdd: (title: string, target: number) => void;
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, activeTaskId, onSelect, onAdd, onToggleDone, onDelete }: TaskListProps) {
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(1);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, target);
    setTitle("");
    setTarget(1);
  };

  const pendingTasks = tasks.filter((t) => !t.done);
  const doneTasks = tasks.filter((t) => t.done);

  return (
    <div className="rounded-2xl border border-white/8 bg-surface/70 p-5 shadow-glass backdrop-blur-md">
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-mist-500">Görevler</h3>

      <form onSubmit={submit} className="mb-3 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ne üzerinde çalışıyorsun?"
          className="flex-1 rounded-lg border border-white/10 bg-night-900 px-3 py-2 text-sm text-mist-100 placeholder:text-mist-700 outline-none focus:border-focus-500"
        />
        <input
          type="number"
          min={1}
          max={12}
          value={target}
          onChange={(e) => setTarget(Math.min(12, Math.max(1, Number(e.target.value) || 1)))}
          title="Hedef pomodoro sayısı"
          className="w-14 rounded-lg border border-white/10 bg-night-900 px-2 py-2 text-center font-mono text-sm text-mist-300 outline-none focus:border-focus-500"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center justify-center rounded-lg bg-focus-500 px-3 text-night-950 transition hover:bg-focus-400"
        >
          <Plus size={16} />
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="py-4 text-center text-xs text-mist-700">
          Henüz görev yok. Bir görev ekle, üzerinde çalıştığın süre otomatik sayılsın.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {[...pendingTasks, ...doneTasks].map((task) => (
            <li
              key={task.id}
              onClick={() => onSelect(task.id)}
              className={`group flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-all ${
                task.id === activeTaskId
                  ? "border-focus-500/40 bg-focus-500/8"
                  : "border-transparent hover:bg-white/4"
              } ${task.done ? "opacity-50" : ""}`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleDone(task.id);
                }}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  task.done ? "border-short-400 bg-short-400 text-night-950" : "border-white/25 text-transparent hover:border-focus-400"
                }`}
              >
                <Check size={11} strokeWidth={3} />
              </button>

              <span className={`min-w-0 flex-1 truncate text-sm text-mist-200 ${task.done ? "line-through" : ""}`}>
                {task.title}
              </span>

              <span className="shrink-0 font-mono text-[11px] text-mist-500">
                {task.pomodoroCount}/{task.targetPomodoros} 🍅
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="shrink-0 rounded-md p-1 text-mist-700 opacity-0 transition-opacity hover:text-rose-400 group-hover:opacity-100"
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
