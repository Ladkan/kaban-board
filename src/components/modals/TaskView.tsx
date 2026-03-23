import { useState, useEffect } from "react";
import type { Task } from "../../types";
import DOMPurify from "dompurify";
import DeleteModal from "./DeleteModal";

interface TaskViewProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
}

export default function TaskView({ isOpen, onClose, task }: TaskViewProps) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    if (visible) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible]);

  function handleClose() {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      onClose();
    }, 250);
  }

  if (!visible) return null;

  return (
    <>
    <div
      className={`fixed inset-0 z-50 flex items-center justify-end transition-colors duration-300
        ${closing ? "bg-on-surface/0" : "bg-on-surface/20"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`absolute inset-0 -z-10 backdrop-blur-sm transition-opacity duration-300
          ${closing ? "opacity-0" : "opacity-100"}`}
      />

      <div
        className={`relative w-full max-w-2xl h-full bg-surface-container-lowest shadow-2xl
                    flex flex-col
                    ${closing ? "animate-slide-out" : "animate-slide-in"}`}
      >
        <header className="h-16 flex items-center justify-between px-8 border-b border-outline-variant/15 shrink-0">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="p-2 cursor-pointer flex justify-center hover:bg-surface-container rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                close
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpenDeleteModal(!openDeleteModal)}
            className="text-on-error-container bg-error-container hover:bg-on-error-container hover:text-error-container transition-colors cursor-pointer rounded-full font-bold px-3 py-2 text-sm"
          >
            Delete
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-10 py-8 space-y-10">
            <section className="flex gap-4 items-center">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-on-surface">
                {task?.title}
              </h2>
              {task?.priority && (
                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider
              ${task.priority === "high" ? "bg-error-container text-on-error-container" : ""}
              ${task.priority === "medium" ? "bg-tertiary-fixed text-on-tertiary-fixed-variant" : ""}
              ${task.priority === "low" ? "bg-secondary-container text-on-secondary-fixed-variant" : ""}
            `}
                >
                  {task.priority}
                </span>
              )}
            </section>

            <section className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[0.65rem] uppercase font-bold tracking-widest text-on-surface-variant">
                  Assignee
                </label>
                {task?.expand?.assignee ? (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {task.expand.assignee.name.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-sm font-semibold text-on-surface">
                      {task.expand.assignee.name}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant/50 p-2">
                    No assignee
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <label className="text-[0.65rem] uppercase font-bold tracking-widest text-on-surface-variant">
                Description
              </label>
              {task?.description ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(task.description),
                  }}
                  className="
                    prose prose-sm max-w-none
                    prose-p:text-on-surface-variant prose-p:leading-relaxed
                    prose-strong:text-on-surface
                    prose-ul:text-on-surface-variant prose-ol:text-on-surface-variant
                    prose-blockquote:border-primary/40 prose-blockquote:text-on-surface-variant
                    prose-code:bg-surface-container-high prose-code:rounded prose-code:px-1 prose-code:text-on-surface
                  "
                />
              ) : (
                <p className="text-sm text-on-surface-variant/50 italic">
                  No description
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
    <DeleteModal isOpen={openDeleteModal} setModal={setOpenDeleteModal} closeModal={handleClose} taskId={task?.id} columnId={task?.column} />
    </>
  );
}
