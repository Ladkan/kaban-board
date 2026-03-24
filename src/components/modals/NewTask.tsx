import { useForm } from "@tanstack/react-form";
import { useTaskStore } from "../../stores/useTaskStore";
import MemberPicker from "./MemberPicker";
import QuillEditor from "../ui/QuillEditor";
import { useEffect } from "react";
import { toast } from "sonner";
import Input from "../form/Input";
import Select from "../form/Select";
import DatePicker from "../form/DatePicker";
import FormHeader from "../form/FormHeader";

interface NewTaskProps {
  isOpen: boolean;
  columId: string | null;
  onClose: () => void;
}

export default function NewTask({ columId, isOpen, onClose }: NewTaskProps) {
  const { createTask } = useTaskStore();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "" as "low" | "medium" | "high" | undefined,
      assignee: "",
      due_date: "",
    },
    onSubmit: async ({ value }) => {
      await createTask(columId as string, value);
      form.reset();
      onClose();
      toast.success("New task added");
    },
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      form.reset();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)] flex flex-col max-h-230.25">
        <FormHeader onClick={onClose} title="Create new task"  />
        <form
          className="px-8 py-6 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          noValidate
        >
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2"
            >
              Task title
            </label>
            <form.Field
              name="title"
              validators={{
                onBlur: ({ value }) =>
                  value.length >= 1 ? undefined : "Enter title",
              }}
            >
              {(field) => (
                <Input field={field} />
              )}
            </form.Field>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2"
            >
              Description
            </label>
            <form.Field name="description">
              {(field) => (
                <QuillEditor
                  onChange={(html) => {
                    const isEmpty =
                      html === "<p><br></p>" || html === "<p></p>";
                    field.handleChange(isEmpty ? "" : html);
                  }}
                />
              )}
            </form.Field>
          </div>
          <div>
            <label
              htmlFor="priority"
              className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2"
            >
              Priority
            </label>
            <form.Field name="priority">
              {(field) => (
                <Select field={field} />
              )}
            </form.Field>
          </div>
          <div>
            <label
              htmlFor="duedate"
              className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2"
            >
              Due Date
            </label>
            <form.Field name="due_date">
              {(field) => (
                <DatePicker field={field} />
              )}
            </form.Field>
          </div>
          <div>
            <label
              htmlFor="assignee"
              className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2"
            >
              Add assignee
            </label>
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
          </div>
          <div className="px-8 py-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => onClose()}
              className="cursor-pointer px-8 py-3 text-on-surface-variant font-headline font-bold text-sm hover:text-on-surface transition-colors active:scale-95"
            >
              Cancel
            </button>
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <button
                  disabled={!canSubmit || !!isSubmitting}
                  className="cursor-pointer px-10 py-3 primary-gradient text-white rounded-full font-headline font-bold text-sm shadow-[0_4px_14px_rgba(0,64,161,0.3)] active:opacity-80 transition-all"
                >
                  Create
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}
