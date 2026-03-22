import { useEffect, useReducer, useTransition } from "react"
import { useParams } from "react-router-dom"
import { useBoardStore } from "../stores/useBoardStore"
import KanbanBoard from "../components/board/KanbanBoard"
import { useColumnStore } from "../stores/useColumnStore"
import { useTaskStore } from "../stores/useTaskStore"
import { client } from "../services/pocketbase"

type State = {
    taskModalOpen: boolean;
    activeColumnId: string | null;
}

const initialState: State = {
    taskModalOpen: false,
    activeColumnId: '',
}

function reducer(state: State, action: Partial<State>): State {
    return {...state, ...action}
}

export default function Board(){

    const { boardId } = useParams<{ boardId: string }>()
    const { boards, activeBoard, setActiveBoard } = useBoardStore()
    const [state, dispatch] = useReducer(reducer, initialState)
    const { fetchColumns } = useColumnStore() 
    const { fetchTasks } = useTaskStore()

    useEffect(() => {
        const board = boards.find(b => b.id === boardId)
        if(board) setActiveBoard(board)
    },[boardId, boards])

    useEffect(() => {
        if(!boardId) return

        fetchColumns(boardId)
        fetchTasks(boardId)

        const unsubColumns = client.collection("columns").subscribe('*', ({ action, record }) => {
            if(record.board !== boardId) return
            fetchColumns(boardId)
        })

        const unsubTask = client.collection("tasks").subscribe('*', () => {
            fetchTasks(boardId)
        })

        return () => {
            unsubColumns.then(fn => fn())
            unsubTask.then(fn => fn())
        }

    }, [boardId])

    function handleAddTask(columnId: string){
        dispatch({ activeColumnId: columnId, taskModalOpen: true })
    }

    return(
        <>
            <section className="px-10 py-8 flex items-end justify-between shrink-0">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">{activeBoard?.title}</h2>
                </div>
            </section>
            <KanbanBoard boardId={activeBoard?.id} onAddTask={handleAddTask} />
        </>
    )
}