import { create } from "zustand";
import {
  createBoard,
  deleteBoard,
  getBoards,
  removeMember,
  updateBoard,
} from "../services/boardService";
import { type RecordModel } from "pocketbase";
import type { Board, BoardMember } from "../types";
import { client } from "../services/pocketbase";

interface BoardStore {
  boards: Board[];
  activeBoard: Board | null;
  isLoading: boolean;
  members: BoardMember[];
  fetchMembers: (boardId: string) => Promise<void>;
  addMember: (
    boardId: string,
    userId: string,
    role: string,
  ) => Promise<void>;
  updateRole: (memberId: string, role: string) => Promise<void>;
  removeMember: (boardId: string, userId: string) => Promise<void>;
  fetchBoard: () => Promise<void>;
  createBoard: (title: string, members: string[]) => Promise<RecordModel>;
  updateBoard: (
    boardId: string,
    title: string,
    members: string[],
  ) => Promise<void>;
  setActiveBoard: (board: Board | null) => void;
  deleteBoard: (boardId: string) => void;
  setMembers: (members: BoardMember[]) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  boards: [],
  activeBoard: null,
  isLoading: false,
  members: [],

  fetchBoard: async () => {
    set({ isLoading: true });
    const boards = await getBoards();
    set({ boards: boards, isLoading: false });
  },

  createBoard: async (title, members) => {
    const board = await createBoard(title, members);
    set((s) => ({ boards: [board as unknown as Board, ...s.boards] }));
    return board;
  },

  setActiveBoard: (board) => set({ activeBoard: board }),

  deleteBoard: async (boardId) => {
    await deleteBoard(boardId);
    set((s) => ({ boards: s.boards.filter((b) => b.id !== boardId) }));
  },

  updateBoard: async (boardId, title, members) => {
    const update = await updateBoard(boardId, title, members);
    set((s) => ({
      boards: s.boards.map((b) =>
        b.id === boardId ? ({ ...b, ...update } as Board) : b,
      ),
      activeBoard:
        s.activeBoard?.id == boardId
          ? ({ ...s.activeBoard, ...update } as Board)
          : s.activeBoard,
    }));
  },

  fetchMembers: async (boardId) => {
    const members = await client
      .collection("board_members")
      .getFullList<BoardMember>({
        filter: `board = "${boardId}"`,
        expand: "user",
      });
    set({ members });
  },

  addMember: async (boardId, userId, role) => {
    const member = await client
      .collection("board_members")
      .create<BoardMember>({
        board: boardId,
        user: userId,
        role,
      });
    set((s) => ({ members: [...s.members, member] }));
  },

  updateRole: async (memberId, role) => {
    await client.collection("board_members").update(memberId, { role });
    set((s) => ({
      members: s.members.map((m) => (m.id === memberId ? { ...m, role } : m)),
    }));
  },

  removeMember: async (boardId, userId) => {
    const memberId = await removeMember(boardId, userId)
    set((s) => ({ members: s.members.filter((m) => m.id !== memberId) }));
  },

  setMembers: async (members) => {
    set({ members })
  }
}));
