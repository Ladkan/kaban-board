import { useForm } from "@tanstack/react-form";
import type React from "react";
import { useBoardStore } from "../../stores/useBoardStore";
import MemberPicker from "./MemberPicker";

interface NewProjectModalProps {
    setNewModal: React.Dispatch<React.SetStateAction<boolean>>;
    newModal: boolean;
}

export default function NewProjectModal({setNewModal, newModal}: NewProjectModalProps){
    
    const { createBoard } = useBoardStore()

      const form = useForm({
        defaultValues: {
          title: "",
          members: [],
        },
        onSubmit: async ({ value }) => {
        //     console.log(value)
          await createBoard(value.title, value.members);
          form.reset()
          setNewModal(!newModal)
        },
      });
    
      if(!newModal) return null

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
            <div className="bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-[0_12px_32px_-4px_rgba(25,28,30,0.12)] overflow-hidden flex flex-col max-h-[921px]">
                <div className="px-8 pt-8 pb-4 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Create new project</h2>
                    </div>
                    <button onClick={() => setNewModal(!newModal)} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">close</button>
                </div>
                <form 
                    className="px-8 py-6 space-y-6 overflow-y-auto"
                    onSubmit={(e) =>{
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                    noValidate
                >
                    <div>
                        <label htmlFor="title" className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Project title</label>
                        <form.Field
                        name="title"
                        validators={{
                            onBlur: ({ value }) =>
                            value.length >= 1 ? undefined : "Enter title",
                        }}
                        >
                        {(field) => (
                            <>
                            <input
                                className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 rounded-t-lg text-on-surface placeholder:text-outline-variant transition-all"
                                type="text"
                                id="title"
                                placeholder="New product"
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {!field.state.meta.isValid && (
                                <em className="text-xs text-[#93000a]">
                                {field.state.meta.errors.join(",")}
                                </em>
                            )}
                            </>
                        )}
                        </form.Field>
                    </div>
                    <div>
                        <label htmlFor="members" className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Add team members</label>
{                        //@ts-ignore
                        <form.Field name="members">
                            {field =>(
                                //@ts-ignore
                                <MemberPicker values={field.state.value} onChange={ids => field.handleChange(ids)} />
                            )}
                        </form.Field>}
                    </div>
                    <div className="px-8 py-8 flex justify-end gap-4">
                            <button type="button" onClick={() => setNewModal(!newModal)} className="cursor-pointer px-8 py-3 text-on-surface-variant font-headline font-bold text-sm hover:text-on-surface transition-colors active:scale-95">
                                Cancel
                            </button>
                    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
                        {([canSubmit, isSubmitting]) => (
                            <button
                            disabled={!canSubmit || !!isSubmitting}
                            className="cursor-pointer px-10 py-3 primary-gradient text-white rounded-full font-headline font-bold text-sm shadow-[0_4px_14px_rgba(0,64,161,0.3)] active:opacity-80 transition-all"
                            >
                            Create
                            </button>
                        )}
                    </form.Subscribe>
                    </div>
                </form>
            </div>
        </div>
    )
}