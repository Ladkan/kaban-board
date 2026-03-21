import type React from "react";

interface NewProjectModalProps {
    setNewModal: React.Dispatch<React.SetStateAction<boolean>>;
    newModal: boolean;
}

export default function NewProjectModal({setNewModal, newModal}: NewProjectModalProps){
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
            <div className="bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)] overflow-hidden flex flex-col max-h-[921px]">
                <div className="px-8 pt-8 pb-4 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Create new project</h2>
                    </div>
                    <button onClick={() => setNewModal(!newModal)} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">close</button>
                </div>
            </div>
        </div>
    )
}