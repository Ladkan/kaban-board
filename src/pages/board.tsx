import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useBoardStore } from "../stores/useBoardStore";
import KanbanBoard from "../components/board/KanbanBoard";
import { useColumnStore } from "../stores/useColumnStore";
import { useTaskStore } from "../stores/useTaskStore";
import { client } from "../services/pocketbase";
import TaskView from "../components/modals/TaskView";
import type { Task } from "../types";
import NewTask from "../components/modals/NewTask";
import { useAuthStore } from "../stores/useAuthStore";
import DeleteModal from "../components/modals/DeleteModal";

export default function Board() {
  const { boardId } = useParams<{ boardId: string }>();
  const { boards, activeBoard, setActiveBoard } = useBoardStore();
  const { fetchColumns } = useColumnStore();
  const { fetchTasks } = useTaskStore();
  const { user } = useAuthStore();

  const [openModal, setOpenModal] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [openTask, setOpenTask] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  useEffect(() => {
    const board = boards.find((b) => b.id === boardId);
    if (board) setActiveBoard(board);
  }, [boardId, boards]);

  const isOwner = activeBoard?.owner === user?.id;

  useEffect(() => {
    if (!boardId) return;

    fetchColumns(boardId);
    fetchTasks(boardId);
    //@ts-ignore
    const unsubColumns = client
      .collection("columns")
      .subscribe("*", ({ action, record }) => {
        if (record.board !== boardId) return;
        fetchColumns(boardId);
      });

    const unsubTask = client.collection("tasks").subscribe("*", () => {
      fetchTasks(boardId);
    });

    return () => {
      unsubColumns.then((fn) => fn());
      unsubTask.then((fn) => fn());
    };
  }, [boardId]);

  function handleAddTask(columnId: string) {
    setActiveColumnId(columnId);
    setOpenModal(!openModal);
  }

  function handleOnTaskOpen(task: Task) {
    setActiveTask(task);
    setOpenTask(!openTask);
  }

  function handleCloseModal() {
    setOpenModal(!openModal);
    setActiveColumnId(null);
  }

  function handleCloseTask() {
    setOpenTask(!openTask);
    setActiveTask(null);
  }

  return (
    <>
      <section className="px-10 py-8 flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
            {activeBoard?.title}
          </h2>
        </div>
        {isOwner ? (
          <button 
            className="text-on-error-container bg-error-container hover:bg-on-error-container hover:text-error-container transition-colors cursor-pointer rounded-full font-bold px-3 py-2 text-sm"
            onClick={() => setOpenDeleteModal(!openDeleteModal)}
            >
            
            Delete
          </button>
        ) : null}
      </section>
      <KanbanBoard
        boardId={activeBoard?.id}
        onAddTask={handleAddTask}
        onTaskOpen={handleOnTaskOpen}
      />
      <NewTask
        isOpen={openModal}
        columId={activeColumnId}
        onClose={handleCloseModal}
      />
      <TaskView isOpen={openTask} task={activeTask} onClose={handleCloseTask} />
      <DeleteModal boardId={boardId} isOpen={openDeleteModal} setModal={setOpenDeleteModal} />
    </>
  );
}
