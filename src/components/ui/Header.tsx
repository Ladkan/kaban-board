import { useAuthStore } from "../../stores/useAuthStore";

export default function Header() {
  const { logout } = useAuthStore();

  return (
    <header className="fixed transition-all ease-in-out top-0 right-0 w-full md:w-[calc(100%-16rem)] h-16 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/15">
      <div className="flex justify-between items-center px-8 w-full h-full font-medium text-base">
        <div className="flex-1">
          <div className="flex items-center md:hidden">
            <h1 className="text-xl font-bold tracking-tighter text-slate-900 leading-tight">
              Kaban Board
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => logout()}
            className="bg-primary/10 text-primary px-6 py-2 rounded-full text-sm font-bold hover:bg-primary hover:text-on-primary transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
