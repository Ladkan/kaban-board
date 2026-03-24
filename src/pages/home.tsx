import { useHotkey } from "@tanstack/react-hotkeys";
import BoardItem from "../components/ui/BoardItem";
import { useBoardStore } from "../stores/useBoardStore";
import { lazy, Suspense, useEffect, useState } from "react";

export default function Home() {

  const BoardModal = lazy(() => import("../components/modals/BoardModal"))

  const { boards, fetchBoard } = useBoardStore();

  const [newModal, setNewModal] = useState(false)

  useHotkey("N", () => setNewModal(true))

  useEffect(() => {
    fetchBoard()
  }, []);

  return (
    <>
      <header className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tighter text-on-surface">
            Dashboard
          </h2>
        </div>
        <button onClick={() => setNewModal(!newModal)} className="cursor-pointer text-sm md:text-base bg-primary text-on-primary px-3 py-1.5 md:px-6 md:py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all group">
          <span className="material-symbols-outlined" data-icon="add">
            add
          </span>
          New Project
        </button>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {boards.map((board) => (
          <BoardItem  key={board.id} board={board} />
        ))}
      </section>
      {newModal ? (
        <Suspense fallback={null}>
          <BoardModal setModal={setNewModal} isOpen={newModal} />
        </Suspense>
      ) : (
        <></>
      )}
    </>
  );
}
