import { lazy, Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useBoardStore } from "../stores/useBoardStore";
import KanbanBoard from "../components/board/KanbanBoard";
import { useColumnStore } from "../stores/useColumnStore";
import { useTaskStore } from "../stores/useTaskStore";
import { client } from "../services/pocketbase";
import type { Task } from "../types";
import { useAuthStore } from "../stores/useAuthStore";

export default function Board() {

  const NewTask = lazy(() => import("../components/modals/NewTask"))
  const TaskView = lazy(() => import("../components/modals/TaskView"))
  const DeleteModal = lazy(() => import("../components/modals/DeleteModal"))
  const BoardModal = lazy(() => import("../components/modals/BoardModal"))

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
  const [openBoardModal, setOpenBoardModal] = useState(false)

  useEffect(() => {
    const board = boards.find((b) => b.id === boardId);
    if (board) setActiveBoard(board);
  }, [boardId, boards]);

  const isOwner = activeBoard?.owner === user?.id;

  useEffect(() => {
    if (!boardId) return;

    fetchColumns(boardId);
    fetchTasks(boardId);
    
    const unsubColumns = client.collection("columns").subscribe("*", ({ record }) => {
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
      <section className="px-5 py-4 md:px-10 md:py-8 flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
            {activeBoard?.title}
          </h2>
        </div>
        {isOwner ? (
          <div className="flex gap-4">
          <button 
            type="button" 
            className="text-on-secondary-container bg-secondary-container hover:bg-on-secondary-container hover:text-secondary-container transition-colors cursor-pointer rounded-full font-bold px-3 py-2 text-sm"
            onClick={() => setOpenBoardModal(!openBoardModal)} 
          >
              Update
          </button>
          <button
            type="button" 
            className="text-on-error-container bg-error-container hover:bg-on-error-container hover:text-error-container transition-colors cursor-pointer rounded-full font-bold px-3 py-2 text-sm"
            onClick={() => setOpenDeleteModal(!openDeleteModal)}
            >
            
            Delete
          </button>
          </div>
        ) : null}
      </section>
      <KanbanBoard
        boardId={activeBoard?.id}
        onAddTask={handleAddTask}
        onTaskOpen={handleOnTaskOpen}
      />
      <Suspense fallback={null}>
        <NewTask
          isOpen={openModal}
          columId={activeColumnId}
          onClose={handleCloseModal}
        />
        <TaskView isOpen={openTask} task={activeTask} onClose={handleCloseTask} />
        <DeleteModal boardId={boardId} isOpen={openDeleteModal} setModal={setOpenDeleteModal} />
        <BoardModal board={boards.find(b => b.id === boardId)} isOpen={openBoardModal} setModal={setOpenBoardModal} />
      </Suspense>
    </>
  );
}
