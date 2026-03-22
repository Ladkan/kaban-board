import { useEffect, useState } from "react";
import type { User } from "../types";
import { client } from "../services/pocketbase";

export function useUser(query: string) {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        let cancelled = false
        setIsLoading(true)

        const timeout = setTimeout(async () => {
            const filter = query ? `name~"${query}"` : ''

            const result = await client.collection('users').getList<User>(1, 10, {
                filter,
                fields: 'id,name',
            })

            if(!cancelled){
                setUsers(result.items)
                setIsLoading(false)
            }

        }, 250)
    
        return () => { 
            cancelled = true 
            clearTimeout(timeout)
        }

    }, [query])

    return { users, isLoading }

}