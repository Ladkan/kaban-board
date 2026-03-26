import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-screen md:h-screen ease-in-out bottom-0 md:w-64 fixed xl:left-0 xl:top-0 flex md:flex-col bg-slate-100 font-semibold text-sm tracking-tight z-50 transition-all">
      <div className="flex md:flex-col justify-center h-full w-full md:py-6 md:px-4">

        <div className="hidden md:flex items-center gap-3 mb-10 px-2">
          <div className="hidden w-10 h-10 rounded-xl bg-primary md:flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">architecture</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-slate-900 leading-tight">
              Kanban Board
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">
              The Orchestrated Workspace
            </p>
          </div>
        </div>

        <nav className="md:flex-1 flex md:block flex-row md:space-y-1 px-4 pb-6 pt-3 items-center justify-around md:py-0 md:px-0 md:pt-0 md:items-start md:justify-normal">
            <Link to="/kanban-board" className="rounded-xl md:rounded-none md:gap-3 flex flex-col md:flex-row items-center justify-center px-4 py-1 md:justify-normal md:px-3 md:py-2.5 text-blue-500 hover:text-slate-900 hover:bg-slate-200 transition-all duration-200">
                <span className="material-symbols-outlined mb-1 md:mb-0">dashboard</span>
                <span className="text-[11px] font-medium tracking-wide uppercase md:text-sm md:tracking-normal">Dashboard</span>
            </Link>
            <Link to="/kanban-board/team" className="rounded-xl md:rounded-none md:gap-3 flex flex-col md:flex-row items-center justify-center px-4 py-1 md:justify-normal md:px-3 md:py-2.5 text-blue-500 hover:text-slate-900 hover:bg-slate-200 transition-all duration-200">
                <span className="material-symbols-outlined mb-1 md:mb-0">group</span>
                <span className="text-[11px] font-medium tracking-wide uppercase md:text-sm md:tracking-normal">Team</span>
            </Link>
        </nav>
      </div>
    </aside>
  );
}
