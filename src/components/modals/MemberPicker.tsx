import { useEffect, useReducer, useRef } from "react";
import { useUser } from "../../hooks/useUser";

interface MemberPickerProps {
  values?: string[];
  value?: string;
  onChange?: (ids: string[]) => void;
  onAdd?: (id: string) => void;
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

export default function MemberPicker({
  value,
  onChange,
  values,
  onAdd,
}: MemberPickerProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoading, users } = useUser(state.query);

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

  function addMember(userId: string) {
    if (values !== undefined && onChange) {
      if (values.includes(userId)) return;

      onChange([...values, userId]);
    }

    if (value !== undefined && onAdd) {
      onAdd(userId);
    }

    dispatch({ query: "" });
  }

  function removeMember(userId: string) {
    if (values && onChange) onChange(values.filter((id) => id !== userId));

    if (value && onAdd) onAdd("");
  }

  const selectedUsers = users.filter(
    (u) => values?.includes(u.id) || value?.match(u.id),
  );

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
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {isLoading && (
            <p className="px-3 py-2 text-sm text-slate-400">Loading...</p>
          )}

          {!isLoading && users.length === 0 && (
            <p className="px-3 py-2 text-sm text-slate-400">No users found</p>
          )}

          {!isLoading &&
            users.map((u) => {
              const isSelected = values?.includes(u.id) || value === u.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  disabled={isSelected}
                  onClick={() => addMember(u.id)}
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

      {(values?.length === 0 && values !== undefined) ||
      (value !== undefined && value.length === 0) ? (
        <p className="mt-2 text-xs text-slate-400">No users</p>
      ) : (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedUsers.map((user) => (
            <div
              className="flex items-center gap-2 bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1.5 rounded-full text-xs font-bold"
              key={user.id}
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <span>{user.name}</span>
              <button
                type="button"
                onClick={() => removeMember(user.id)}
                className="material-symbols-outlined text-[14px]"
              >
                close
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
