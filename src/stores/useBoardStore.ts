import { create } from "zustand";
import { createBoard, deleteBoard, getBoards, updateBoard } from "../services/boardService";
import { type RecordModel } from "pocketbase";
import type { Board } from "../types";

interface BoardStore {
    boards: Board[];
    activeBoard: Board | null;
    isLoading: boolean;
    fetchBoard: () => Promise<void>;
    createBoard: (title: string, members: string[]) => Promise<RecordModel>;
    updateBoard: (boardId: string, title: string, members: string[]) => Promise<void>;
    setActiveBoard: (board: Board) => void;
    deleteBoard: (boardId: string) => void;
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
    
    createBoard: async (title, members) => {
        const board = await createBoard(title, members)
        set((s) => ({ boards: [board as unknown as Board, ...s.boards] }))
        return board
    },

    setActiveBoard: (board) => set({ activeBoard: board }),

    deleteBoard: async (boardId) => {
        await deleteBoard(boardId)
        set((s) => ({ boards: s.boards.filter(b => b.id !== boardId) }))
    },

    updateBoard: async (boardId, title, members) => {
        const update = await updateBoard(boardId, title, members)
        set((s) => ({
            boards: s.boards.map((b) => b.id === boardId ? ({...b, ...update} as Board) : b),
            activeBoard: s.activeBoard?.id == boardId ? ({...s.activeBoard, ...update} as Board) : s.activeBoard,
        }))
    }

}))