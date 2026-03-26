import { useEffect, useReducer, useRef } from "react";
import { useBoardStore } from "../../stores/useBoardStore";
import { useUser } from "../../hooks/useUser";
import { client } from "../../services/pocketbase";

interface MemberSelectProps {
  onChange: (ids: string[]) => void;
  boardId: string;
  values?: string[];
}

type State = {
  query: string;
  isOpen: boolean;
};

const initialState: State = {
  isOpen: false,
  query: "",
};

function reducer(state: State, action: Partial<State>): State {
  return { ...state, ...action };
}

export default function MemberSelect({
  onChange,
  boardId,
  values,
}: MemberSelectProps) {
  const members = useBoardStore((s) => s.members);
  const updateRole = useBoardStore((s) => s.updateRole);
  const addMember = useBoardStore((s) => s.addMember);
  const fetchMembers = useBoardStore((s) => s.fetchMembers);
  const removeMember = useBoardStore((s) => s.removeMember);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { isLoading, users } = useUser(state.query);
  const containerRef = useRef<HTMLDivElement>(null);
  const ids = new Set(members.map((m) => m.user));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        dispatch({ isOpen: false });
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleRoleChange(role: string, memberId: string) {
    await updateRole(memberId, role);
  }

  useEffect(() => {
    const unsubMembers = client
      .collection("board_members")
      .subscribe("*", ({ record }) => {
        if (record.board !== boardId) return;
        fetchMembers(boardId);
      });

    return () => {
      unsubMembers.then((fn) => fn());
    };
  }, [boardId]);

  async function handleAddMember(userId: string) {
    if (values) {
      if (values.includes(userId)) return;
      onChange([...values, userId]);
    } else {
      await addMember(boardId, userId, "viewer");
    }
  }

  async function handleRemoveMember(userId: string) {
    await removeMember(boardId, userId);
  }

  return (
    <div className="relative" ref={containerRef}>
      <input
        className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 rounded-t-lg text-on-surface placeholder:text-outline-variant transition-all"
        type="text"
        id="members"
        value={state.query}
        placeholder="Finde user..."
        autoComplete="off"
        onChange={(e) => dispatch({ query: e.target.value })}
        onFocus={() => dispatch({ isOpen: true })}
      />

      {state.isOpen && (
        <div className="absolute z-50 w-full my-1.5 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {isLoading && (
            <p className="px-3 py-2 text-sm text-slate-400">Loading...</p>
          )}

          {!isLoading && users.length === 0 && (
            <p className="px-3 py-2 text-sm text-slate-400">No users found</p>
          )}

          {!isLoading &&
            users.map((u) => {
              const isSelected = ids.has(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  disabled={isSelected}
                  onClick={() => handleAddMember(u.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {u.name}
                    </p>
                  </div>
                </button>
              );
            })}
        </div>
      )}

      <div className="bg-surface-container-low rounded-xl p-2 space-y-1">
        {members.length === 0 ? (
          <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
            <p className="font-headline font-bold text-on-surface text-sm">
              No users
            </p>
          </div>
        ) : (
          <>
            {members.map((m) => {
              return (
                <div key={m.id} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {m.expand?.user?.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-headline font-bold text-on-surface text-sm">
                      {m.expand?.user?.name}
                    </span>
                  </div>
                  <div className="flex gap-4 justify-center items-center">
                    <div className="relative">
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(e.target.value, m.id)}
                        className="bg-transparent border-none text-xs font-bold text-on-surface-variant focus:ring-0 cursor-pointer appearance-none pr-8"
                      >
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-lg">
                        expand_more
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveMember(m.expand?.user?.id as string)
                      }
                      className="material-symbols-outlined text-[14px]"
                    >
                      close
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
