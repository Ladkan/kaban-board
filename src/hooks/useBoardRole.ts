import { useMemo } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useBoardStore } from "../stores/useBoardStore";
import type { BoardRole } from "../types";

export function useBoardRole(): BoardRole {
    const user = useAuthStore(s => s.user)
    const activeBoard = useBoardStore(s => s.activeBoard)
    const members = useBoardStore(s => s.members)

    return useMemo(() => {
        if(!user || !activeBoard) return 'viewer'
        if(activeBoard.owner === user.id) return 'owner'
        
        const membership = members.find(m => m.user === user.id)
        return membership?.role ?? 'viewer'

    }, [user, activeBoard, members])
}