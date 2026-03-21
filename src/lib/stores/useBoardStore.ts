import { create } from "zustand";
import { createBoard, getBoards } from "../services/boardService";
import { type RecordModel } from "pocketbase";
import type { Board } from "../types";

interface BoardStore {
    boards: Board[];
    activeBoard: Board | null;
    isLoading: boolean;
    fetchBoard: () => Promise<void>;
    createBoard: (title: string) => Promise<RecordModel>;
    setActiveBoard: (board: Board) => void; 
}

export const useBoardStore = create<BoardStore>((set) => ({
    boards: [],
    activeBoard: null,
    isLoading: false,

    fetchBoard: async () => {
        set({ isLoading: true })
        const boards = await getBoards()
        set({ boards: boards as unknown as Board[], isLoading: false })
    },
    
    createBoard: async (title) => {
        const board = await createBoard(title)
        set((s) => ({ boards: [board as unknown as Board, ...s.boards] }))
        return board
    },

    setActiveBoard: (board) => set({ activeBoard: board })

}))