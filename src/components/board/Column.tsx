import type { Column as ColumnType, Task } from "../../types";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { useFilteredTasks, useTaskStore } from "../../stores/useTaskStore";
import { useBoardRole } from "../../hooks/useBoardRole";
import { CSS } from "@dnd-kit/utilities";

interface ColumnProps {
  column:     ColumnType;
  onAddTask:  (columnId: string) => void;
  onTaskOpen: (task: Task) => void;
}


export default function Column({ column, onAddTask, onTaskOpen }: ColumnProps) {
    const tasks = useFilteredTasks(column.id)
    const searchQuery = useTaskStore(s => s.searchQuery)
    const totalCount = useTaskStore(s => s.tasksByColumn[column.id]?.length ?? 0)
    const { setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({ id: column.id, data: { type: "Column", column } })
    const role = useBoardRole()
    
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if(isDragging)
        return <div ref={setNodeRef} style={style} className="w-80 shrink-0 opacity-30 bg-surface-container-high rounded-xl border-2 border-primary" />

    return(
        <div ref={setNodeRef} style={style} className="w-80 shrink-0 flex flex-col max-h-full">
            <div {...attributes} {...listeners} className="flex items-center justify-between px-3 py-4 sticky top-0 bg-background/50 backdrop-blur-sm z-10 cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-2 pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <h3 className="font-headline text-sm font-bold tracking-tight text-on-surface uppercase">{column.title}</h3>
                    <span className="bg-surface-container-high text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full font-bold">{searchQuery ? `${tasks.length} / ${totalCount}` : tasks.length}</span>
                </div>
            </div>
            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 space-y-4 pr-1 min-h-125">
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} onTaskOpen={onTaskOpen} />
                    ))}
                    {(role === 'owner' || role === 'editor') && (
                    <button onClick={() => onAddTask(column.id)} className="w-full py-4 border-2 border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant/50 flex items-center justify-center gap-2 hover:border-primary/50 hover:text-primary transition-all group">
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        <span className="text-sm font-bold">Add Task</span>
                    </button>
                    )}
                </div>
            </SortableContext>
        </div>
    )

}   