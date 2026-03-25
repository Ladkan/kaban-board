import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types";
import { format, isToday } from "date-fns"

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onTaskOpen?: (task: Task) => void;
}

const PRIORITY_STYLES = {
  high: "bg-error-container text-on-error-container",
  medium: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  low: "bg-secondary-container text-on-secondary-fixed-variant",
} as const;

export function TaskCard({
  task,
  isOverlay = false,
  onTaskOpen,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={() => onTaskOpen?.(task)}
      className={`
        bg-surface-container-lowest relative rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)] group cursor-pointer border border-transparent hover:border-primary/5
        ${
          isDragging
            ? "opacity-40 shadow-none"
            : "hover:border-slate-300 hover:shadow-sm"
        }
        ${isOverlay ? "shadow-lg rotate-1 cursor-grabbing" : ""}
      `}
    >
      <div
        {...listeners}
        className="h-6 cursor-grab z-10 fixed top-0 left-0 w-full active:cursor-grabbing touch-none"
        onClick={(e) => e.stopPropagation()}
      ></div>
      <div className="flex justify-between items-start mb-3">
        {task.priority && (
          <span
            className={`${PRIORITY_STYLES[task.priority]} text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider`}
          >
            {task.priority}
          </span>
        )}
        <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary text-sm">
          attachment
        </span>
      </div>
      <h4 className="font-headline text-base font-bold text-on-surface leading-tight mb-2">
        {task.title}
      </h4>
      <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {task.expand?.assignee && (
          <>
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-bold text-primary">
              {task.expand.assignee.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant">
              {task.expand.assignee.name}
            </span>
          </>
        )}
        </div>
        {task.due_date && (
          <span className={`text-[10px] font-bold ${isToday(new Date(task.due_date)) ? "text-primary" : "text-on-surface-variant/60"} `}>
            {isToday(new Date(task.due_date)) ? "Today" : format(new Date(task.due_date), "dd/MM")}
          </span>
        )}
      </div>
    </div>
  );
}
