import { useForm } from "@tanstack/react-form";
import { useTaskStore } from "../../stores/useTaskStore";
import MemberPicker from "./MemberPicker";
import QuillEditor from "../ui/QuillEditor";

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
      priority: "" as "low" | "medium" | "high" | undefined ,
      assignee: "",
    },
    onSubmit: async ({ value }) => {
      //     console.log(value)
      await createTask(columId as string, value);
      form.reset();
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)] flex flex-col max-h-230.25">
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">
              Create new task
            </h2>
          </div>
          <button
            onClick={() => onClose()}
            className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors"
          >
            close
          </button>
        </div>
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
                <>
                  <input
                    className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 rounded-t-lg text-on-surface placeholder:text-outline-variant transition-all"
                    type="text"
                    id="title"
                    placeholder="New product"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {!field.state.meta.isValid && (
                    <em className="text-xs text-[#93000a]">
                      {field.state.meta.errors.join(",")}
                    </em>
                  )}
                </>
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
              {field => (
                <QuillEditor 
                    onChange={html => {
                        const isEmpty = html === '<p><br></p>' || html === '<p></p>'
                        field.handleChange(isEmpty ? '' : html)
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
              {field => (
                <div className="w-full gap-2 flex border-none px-4 py-3 rounded-t-lg text-on-surface appearance-none transition-all">
                    {(["low","medium","high"] as const).map(p => {
                        const styles = {
                            low:    "bg-secondary-container text-on-secondary-fixed-variant",
                            medium: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
                            high:   "bg-error-container text-on-error-container",
                        }

                        const isActive = field.state.value === p

                        return(
                            <button 
                                key={p}
                                type="button"
                                onClick={() => field.handleChange(isActive ? undefined : p)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${isActive ? styles[p] + " ring-2 ring-offset-1 ring-current" : "bg-surface-container-high text-on-surface-variant opacity-60 hover:opacity-100"}`}
                            >
                                {p}
                            </button>
                        )
                    
                    })}
                </div>
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
              {field => (
                <>
                    <MemberPicker value={field.state.value} onAdd={(e) => field.handleChange(e)} />
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
