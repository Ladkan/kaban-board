import { useNavigate } from "react-router-dom";
import { useBoardStore } from "../../stores/useBoardStore";
import { useTaskStore } from "../../stores/useTaskStore";
import { useEffect } from "react";
import { toast } from "sonner";

interface DeleteModalProps {
  isOpen: boolean;
  boardId?: string | undefined;
  taskId?: string | undefined;
  columnId?: string;
  closeModal?: () => void;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteModal({
  isOpen,
  setModal,
  boardId,
  taskId,
  columnId,
  closeModal,
}: DeleteModalProps) {

    const { deleteBoard } = useBoardStore()
    const { deleteTask } = useTaskStore()

    const navigate = useNavigate()

    useEffect(() => {
      function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") setModal(!isOpen);
      }
      if (isOpen) document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [isOpen]);

    function handleDelete(){
        if(boardId){
            deleteBoard(boardId)
            setModal(!isOpen)
            navigate("/kaban-board", { replace: true })
            toast.warning("Board deleted")
        }
        if(taskId && closeModal){
            deleteTask(taskId,columnId as string)
            setModal(!isOpen)
            closeModal()
            toast.warning("Task deleted")
        }
    }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/5 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-surface-container-lowest shadow-2xl rounded-xl overflow-hidden border border-outline-variant/20">
        <div className="flex flex-col items-center pt-10 pb-4">
          <div className="w-16 h-16 bg-error-container flex items-center justify-center rounded-full mb-6">
            <span className="material-symbols-outlined text-on-error-container text-3xl">
              warning
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight px-8 text-center">
            Delete {boardId ? "board" : "task"}
          </h2>
        </div>
        <div className="px-10 pb-8">
          <p className="text-on-surface-variant text-center leading-relaxed font-body">
            Are you sure you want to delete this {boardId ? "board" : "task"}?
            This action{" "}
            <span className="font-bold text-on-surface">cannot be undone</span>.
          </p>
        </div>
        <div className="bg-surface-container-low px-10 py-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleDelete()}
            className="cursor-pointer w-full py-4 px-6 bg-linear-to-br from-error to-[#93000a] text-on-error font-manrope font-extrabold text-sm uppercase tracking-widest rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">
              delete_forever
            </span>
            Confirm Destruction
          </button>
          <button
            type="button"
            onClick={() => setModal(!isOpen)}
            className="cursor-pointer w-full py-3 px-6 bg-transparent text-on-surface-variant font-manrope font-bold text-sm uppercase tracking-widest rounded-full hover:bg-surface-container-high transition-colors duration-200"
          >
            Cancel Action
          </button>
        </div>
      </div>
    </div>
  );
}
