import { useForm } from "@tanstack/react-form";
import type React from "react";
import { useBoardStore } from "../../stores/useBoardStore";
import { useEffect } from "react";
import type { Board } from "../../types";
import { toast } from "sonner";
import Input from "../form/Input";
import FormHeader from "../form/FormHeader";
import MemberSelect from "../form/MemberSelect";

interface BoardModallProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  board?: Board;
}

export default function BoardModal({
  setModal,
  isOpen,
  board,
}: BoardModallProps) {
  const createBoard = useBoardStore((s) => s.createBoard);
  const updateBoard = useBoardStore((s) => s.updateBoard);
  const removeMember = useBoardStore((s) => s.removeMember);
  const addMember = useBoardStore((s) => s.addMember);

  const form = useForm({
    defaultValues: {
      title: board?.title ?? "",
      members: board?.members ?? [],
    },
    onSubmit: async ({ value }) => {
      if (board) {
        if (value.members !== board.members) {
          board.members.forEach(async (m) => {
            if (!value.members.includes(m)) await removeMember(board.id, m);
          });
          value.members.forEach(async (m) => {
            if (!board.members.includes(m))
              await addMember(board.id, m, "viewer");
          });
        }

        await updateBoard(
          board.id,
          value.title as string,
          value.members as string[],
        );
        toast.info("Board updated");
      } else {
        await createBoard(value.title as string, value.members as string[]);
        toast.success("New board created");
      }

      form.reset();
      setModal(!isOpen);
    },
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setModal(!isOpen);
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: board?.title ?? "",
        members: (board?.members as string[]) ?? [],
      });
    }
  }, [isOpen, board?.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)] overflow-hidden flex flex-col max-h-230.25">
        <FormHeader
          title={board ? "Update board" : "Create new board"}
          onClick={() => setModal(!isOpen)}
        />
        <form
          className="px-8 py-6 space-y-6 overflow-y-auto"
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
              Project title
            </label>
            <form.Field
              name="title"
              validators={{
                onBlur: ({ value }) =>
                  value.length >= 1 ? undefined : "Enter title",
              }}
            >
              {(field) => <Input field={field} />}
            </form.Field>
          </div>
          <div>
            <label
              htmlFor="members"
              className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2"
            >
              Add team members
            </label>
            {
              <form.Field name="members">
                {(field) => (
                  <MemberSelect
                    boardId={board?.id as string}
                    onChange={(ids) => field.handleChange(ids)}
                  />
                  // <MemberPicker
                  //   values={field.state.value}
                  //   onChange={(ids) => field.handleChange(ids)}
                  // />
                )}
              </form.Field>
            }
          </div>
          <div className="px-8 py-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setModal(!isOpen)}
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
                  {board ? "Update" : "Create"}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}
