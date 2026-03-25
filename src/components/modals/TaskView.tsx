import { useState, useEffect, lazy, Suspense } from "react";
import type { Task } from "../../types";
import DOMPurify from "dompurify";
import { isOverDue } from "../../utils";
import { differenceInDays, format, startOfDay } from "date-fns";
import { useForm } from "@tanstack/react-form";
import { useTaskStore } from "../../stores/useTaskStore";
import { toast } from "sonner";
import MemberPicker from "./MemberPicker";
import QuillEditor from "../ui/QuillEditor";
import Input from "../form/Input";
import Select from "../form/Select";
import DatePicker from "../form/DatePicker";
import { useBoardRole } from "../../hooks/useBoardRole";

interface TaskViewProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
}

export default function TaskView({ isOpen, onClose, task }: TaskViewProps) {
  const DeleteModal = lazy(() => import("./DeleteModal"));

  const { updateTask } = useTaskStore();
  const role = useBoardRole();

  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [taskDraft, setTaskDraft] = useState<Task | null>(task);

  const form = useForm({
    defaultValues: {
      title: taskDraft?.title || "",
      description: taskDraft?.description,
      priority: taskDraft?.priority,
      assignee: taskDraft?.assignee,
      due_date: taskDraft?.due_date,
    },
    onSubmit: async ({ value }) => {
      if (!task) return;

      await updateTask(task.id, value);
      setTaskDraft((prev) => (prev ? { ...prev, ...value } : prev));
      setEditMode(false);
      toast.info("Task updated");
    },
  });

  useEffect(() => {
    if(isOpen) setTaskDraft(task)
  }, [isOpen, task])

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
    setEditMode(false);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      onClose();
    }, 250);
  }

  if (!visible) return null;

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
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
            <div className="gap-2 flex justify-center items-center">
              {editMode && (
                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
                  {([canSubmit, isSubmitting]) => (
                    <button
                      disabled={!canSubmit || !!isSubmitting}
                      className="cursor-pointer px-3 py-2 text-sm primary-gradient text-white rounded-full font-bold shadow-[0_4px_14px_rgba(0,64,161,0.3)] active:opacity-80 transition-all"
                    >
                      Update
                    </button>
                  )}
                </form.Subscribe>
              )}
              {(role === "editor" || role === "owner") && (
                <>
                  <button
                    type="button"
                    onClick={() => setEditMode(!editMode)}
                    className="text-on-secondary-container bg-secondary-container hover:bg-on-secondary-container hover:text-secondary-container transition-colors cursor-pointer rounded-full font-bold px-3 py-2 text-sm"
                  >
                    {editMode ? "Cancel" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenDeleteModal(!openDeleteModal)}
                    className="text-on-error-container bg-error-container hover:bg-on-error-container hover:text-error-container transition-colors cursor-pointer rounded-full font-bold px-3 py-2 text-sm"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="px-10 py-8 space-y-10">
              <section className="flex gap-4 items-center">
                {editMode ? (
                  <form.Field
                    name="title"
                    validators={{
                      onBlur: ({ value }) =>
                        value.length >= 1 ? undefined : "Enter title",
                    }}
                  >
                    {(field) => <Input field={field} />}
                  </form.Field>
                ) : (
                  <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-on-surface">
                    {taskDraft?.title}
                  </h2>
                )}
                {editMode ? (
                  <form.Field name="priority">
                    {(field) => <Select field={field} />}
                  </form.Field>
                ) : (
                  <>
                    {taskDraft?.priority && (
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider
              ${taskDraft.priority === "high" ? "bg-error-container text-on-error-container" : ""}
              ${taskDraft.priority === "medium" ? "bg-tertiary-fixed text-on-tertiary-fixed-variant" : ""}
              ${taskDraft.priority === "low" ? "bg-secondary-container text-on-secondary-fixed-variant" : ""}
            `}
                      >
                        {taskDraft.priority}
                      </span>
                    )}
                  </>
                )}
              </section>

              <section className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[0.65rem] uppercase font-bold tracking-widest text-on-surface-variant">
                    Assignee
                  </label>
                  {editMode ? (
                    <form.Field name="assignee">
                      {(field) => (
                        <>
                          <MemberPicker
                            value={field.state.value}
                            onAdd={(e) => field.handleChange(e)}
                          />
                        </>
                      )}
                    </form.Field>
                  ) : (
                    <>
                      {taskDraft?.expand?.assignee ? (
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {taskDraft.expand.assignee.name
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <p className="text-sm font-semibold text-on-surface">
                            {taskDraft.expand.assignee.name}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-on-surface-variant/50 p-2">
                          No assignee
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-[0.65rem] uppercase font-bold tracking-widest text-on-surface-variant">
                    Due Date
                  </label>
                  {editMode ? (
                    <form.Field name="due_date">
                      {(field) => <DatePicker field={field} />}
                    </form.Field>
                  ) : (
                    <>
                      {taskDraft?.due_date ? (
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer group">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${isOverDue(taskDraft.due_date) ? "text-on-error-container bg-error-container" : "text-primary bg-primary/10"}`}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "14px" }}
                            >
                              calendar_today
                            </span>
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm font-semibold ${isOverDue(taskDraft.due_date) ? "text-error" : "text-on-surface-variant"}`}
                            >
                              {format(new Date(taskDraft.due_date), "dd/MM/yyyy")}
                            </p>
                            {isOverDue(taskDraft.due_date) && (
                              <p className="text-[0.65rem] text-on-error-container/60">
                                Overdue by{" "}
                                {differenceInDays(
                                  startOfDay(new Date()),
                                  startOfDay(new Date(taskDraft.due_date)),
                                )}{" "}
                                days
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-on-surface-variant/50 p-2">
                          No due date
                        </p>
                      )}
                    </>
                  )}
                </div>
              </section>

              <section className="space-y-3">
                <label className="text-[0.65rem] uppercase font-bold tracking-widest text-on-surface-variant">
                  Description
                </label>
                {editMode ? (
                  <form.Field name="description">
                    {(field) => (
                      <QuillEditor
                        value={field.state.value}
                        onChange={(html) => {
                          const isEmpty =
                            html === "<p><br></p>" || html === "<p></p>";
                          field.handleChange(isEmpty ? "" : html);
                        }}
                      />
                    )}
                  </form.Field>
                ) : (
                  <>
                    {taskDraft?.description ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(taskDraft.description),
                        }}
                      />
                    ) : (
                      <p className="text-sm text-on-surface-variant/50 italic">
                        No description
                      </p>
                    )}
                  </>
                )}
              </section>
            </div>
          </div>
        </div>
      </form>
      <Suspense fallback={null}>
        <DeleteModal
          isOpen={openDeleteModal}
          setModal={setOpenDeleteModal}
          closeModal={handleClose}
          taskId={taskDraft?.id}
          columnId={taskDraft?.column}
        />
      </Suspense>
    </>
  );
}
