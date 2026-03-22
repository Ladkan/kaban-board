import { useEffect, useReducer, useRef } from "react";
import { useUser } from "../../hooks/useUser";

interface MemberPickerProps {
    value: string[];
    onChange: (ids: string[]) => void;
}

type State = {
    query: string;
    isOpen: boolean;
}

const initialState: State = {
    isOpen: false,
    query: '',
}

function reducer(state: State, action: Partial<State>): State {
    return {...state, ...action}
}

export default function MemberPicker({value, onChange}: MemberPickerProps) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const containerRef = useRef<HTMLDivElement>(null)
    const { isLoading, users } = useUser(state.query)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if(containerRef.current && !containerRef.current.contains(e.target as Node))
                dispatch({ isOpen: false })
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function addMember(userId: string) {
        if(value.includes(userId)) return

        onChange([...value, userId])
        dispatch({ query: '' })

    }

    function removeMember(userId: string) {
        onChange(value.filter(id => id !== userId))
    }

    const selectedUsers = users.filter(u => value.includes(u.id))

    return(
        <div className="relative" ref={containerRef}>
            <input
                className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 rounded-t-lg text-on-surface placeholder:text-outline-variant transition-all" 
                type="text"
                id="members"
                value={state.query}
                placeholder="Finde user..."
                autoComplete="off"
                onChange={e => dispatch({ query: e.target.value })}
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

                    {!isLoading && users.map(u => {
                        const isSelected = value.includes(u.id)
                        return(
                            <button
                                key={u.id}
                                type="button"
                                disabled={isSelected}
                                onClick={() => addMember(u.id)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 truncate">{u.name}</p>
                                </div>
                            </button>
                        )
                    })}

                </div>
            )}

            {value.length === 0 ? (
                <p className="mt-2 text-xs text-slate-400">No users</p>
            ) : (
                <div className="flex flex-wrap gap-2 mt-4">
                    {selectedUsers.map(user => (
                        <div className="flex items-center gap-2 bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1.5 rounded-full text-xs font-bold" key={user.id}>
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
    )

}