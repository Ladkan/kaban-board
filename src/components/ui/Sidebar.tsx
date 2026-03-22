import { Link } from "react-router-dom";


export default function Sidebar() {
  return (
    <aside className="w-screen md:h-screen ease-in-out bottom-0 md:w-64 fixed xl:left-0 xl:top-0 flex md:flex-col bg-slate-100 font-semibold text-sm tracking-tight z-50 transition-all">
      <div className="flex md:flex-col justify-center h-full w-full py-4 px-6 md:py-6 md:px-4">

        <div className="hidden md:flex items-center gap-3 mb-10 px-2">
          <div className="hidden w-10 h-10 rounded-xl bg-primary md:flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">architecture</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-slate-900 leading-tight">
              Kaban Board
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">
              The Orchestrated Workspace
            </p>
          </div>
        </div>

        <nav className="md:flex-1 flex md:block flex-row space-y-1">
            <Link to="/kaban-board" className="flex items-center gap-3 px-3 py-2.5 text-blue-500 hover:text-slate-900 hover:bg-slate-200 transition-all duration-200">
                <span className="material-symbols-outlined">dashboard</span>
                <span className="hidden md:block">Dashboard</span>
            </Link>
            <Link to="/kaban-board/team" className="flex items-center gap-3 px-3 py-2.5 text-blue-500 hover:text-slate-900 hover:bg-slate-200 transition-all duration-200">
                <span className="material-symbols-outlined">group</span>
                <span className="hidden md:block">Team</span>
            </Link>
        </nav>
      </div>
    </aside>
  );
}
