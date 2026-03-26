import { useEffect, useReducer } from "react";
import { client } from "../../services/pocketbase";
import type { Board } from "../../types";
import { Link } from "react-router-dom";

interface BoardProps {
    board: Board;
}

type State = {
    tasksCount: number;
    tasksCompleted: number;
    isLoading: boolean;
}

const initialState: State = {
    tasksCompleted: 0,
    tasksCount: 0,
    isLoading: true,
}

function reducer(state: State, action: Partial<State>): State {
    return {...state, ...action}
}

export default function BoardItem({ board }: BoardProps) {

    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        let cancelled = false
        
    async function getStats() {
    dispatch({ isLoading: true });
      try {
        const doneColumns = await client.collection("columns").getFullList({
          filter: `board = "${board.id}" && title = "Done"`,
          fields: "id",
        });


        const doneColumnId = doneColumns[0]?.id;

        const [total, done] = await Promise.all([
          
          await client.collection("tasks").getList(1, 0, {
            filter: `column.board = "${board.id}"`,
            fields: "id",
          }),

          doneColumnId
            ? await client.collection("tasks").getList(1, 0, {
                filter: `column = "${doneColumnId}"`,
                fields: "id",
              })
            : Promise.resolve({ totalItems: 0 }),
        ]);

        if (cancelled) return;

        const percentage =
          total.totalItems === 0
            ? 0
            : Math.round((done.totalItems / total.totalItems) * 100);

        dispatch({
          tasksCount: total.totalItems,
          tasksCompleted: percentage,
          isLoading: false,
        });
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load task stats", err);
        dispatch({
          tasksCount: 0,
          tasksCompleted: 0,
          isLoading: false,
        });
      }
    }

    getStats();

    return () => {cancelled = true}
    }, [board.id])

    return(
        <article className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 overflow-hidden">
            <Link to={"/kanban-board/board/"+board.id} className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-extrabold mb-2  group-hover:text-primary transition-colors">{board.title}</h3>
                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-tighter text-on-surface-variant">Progress</span>
                        <span className="text-[11px] font-bold text-primary">{state.isLoading ? '...' : `${state.tasksCompleted}%`}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
                        <div style={{ width: `${state.tasksCompleted}%` }} className={`h-full bg-primary rounded-full transition-all duration-1000`}></div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <span className="material-symbols-outlined text-lg" data-icon="task_alt">task_alt</span>
                            <span className="text-xs font-bold text-on-surface">{state.tasksCount} Tasks</span>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    )
} 