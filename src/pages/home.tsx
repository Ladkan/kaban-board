import NewProjectModal from "../lib/components/modals/NewProject.modal";
import BoardItem from "../lib/components/ui/BoardItem";
import { useBoardStore } from "../lib/stores/useBoardStore";
import { useEffect, useState } from "react";

export default function Home() {
  const { boards, fetchBoard } = useBoardStore();

  const [newModal, setNewModal] = useState(false)

  useEffect(() => {
    fetchBoard();
  }, []);

  return (
    <>
      <header className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-on-surface">
            Dashboard
          </h2>
        </div>
        <button onClick={() => setNewModal(!newModal)} className="cursor-pointer bg-primary text-on-primary font-label px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all group">
          <span className="material-symbols-outlined" data-icon="add">
            add
          </span>
          New Project
        </button>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {boards.map((board) => (
          <BoardItem key={board.id} board={board} />
        ))}
      </section>
      {newModal ? <NewProjectModal setNewModal={setNewModal} newModal={newModal} /> : ''}
    </>
  );
}
