import { useDroppable } from "@dnd-kit/core";
import type { Column as ColumnType, Task } from "../../types";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  column:     ColumnType;
  tasks:      Task[];
  onAddTask:  (columnId: string) => void;
  onTaskOpen: (task: Task) => void;
}


export default function Column({ column, tasks, onAddTask, onTaskOpen }: ColumnProps) {

    const { setNodeRef } = useDroppable({ id: column.id })

    return(
        <div className="w-80 shrink-0 flex flex-col max-h-full">
            <div className="flex items-center justify-between px-3 py-4 sticky top-0 bg-background/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <h3 className="font-headline text-sm font-bold tracking-tight text-on-surface uppercase">{column.title}</h3>
                    <span className="bg-surface-container-high text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full font-bold">{tasks.length}</span>
                </div>
            </div>
            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div ref={setNodeRef} className="flex-1 space-y-4 pr-1 min-h-24">
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} onTaskOpen={onTaskOpen} />
                    ))}
                    <button onClick={() => onAddTask(column.id)} className="w-full py-4 border-2 border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant/50 flex items-center justify-center gap-2 hover:border-primary/50 hover:text-primary transition-all group">
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        <span className="text-sm font-bold">Add Task</span>
                    </button>
                </div>
            </SortableContext>
        </div>
    )

}   