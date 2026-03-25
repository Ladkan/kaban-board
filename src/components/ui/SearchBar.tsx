import { useEffect, useState } from "react";
import { useTaskStore } from "../../stores/useTaskStore";

export default function SearchBar(){
    const setSearchQuery = useTaskStore(s => s.setSearchQuery)
    const [value, setValue] = useState('')

    useEffect(() => {
        setValue('')
    },[])

    useEffect(() => {
        const timeout = setTimeout(() => setSearchQuery(value), 200)
        return () => clearTimeout(timeout)
    }, [value])

    return(
        <div className="relative w-fit md:w-full max-w-md group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
            <input value={value} onChange={e => setValue(e.target.value)} type="text" className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-on-surface-variant/60" />
        </div>
    )

}