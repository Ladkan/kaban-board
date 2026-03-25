// stores/useColumnStore.ts
import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import type { Column } from "../types";
import { client } from "../services/pocketbase";

interface ColumnStore {
  columns: Column[];
  isLoading: boolean;
  fetchColumns: (boardId: string) => Promise<void>;
  addColumn: (boardId: string, title: string) => Promise<void>;
  removeColumn: (id: string) => Promise<void>;
  reorderColumns: (activeId: string, overId: string) => Promise<void>;
}

export const useColumnStore = create<ColumnStore>((set, get) => ({
  columns: [],
  isLoading: false,

  fetchColumns: async (boardId) => {
    set({ isLoading: true });
    try {
      const columns = await client.collection("columns").getFullList<Column>({
        filter: `board = "${boardId}"`,
        sort: "order",
      });
      set({ columns });
    } finally {
      set({ isLoading: false });
    }
  },

  addColumn: async (boardId, title) => {
    try {
      const cols = get().columns;
      const maxOrder = cols.length ? Math.max(...cols.map((c) => c.order)) : 0;
      const column = await client.collection("columns").create<Column>({
        title,
        order: maxOrder + 1000,
        board: boardId,
      });
      set((s) => ({ columns: [...s.columns, column] }));
    } catch (err) {
      console.error(err);
    }
  },

  removeColumn: async (id) => {
    await client.collection("columns").delete(id);
    set((s) => ({ columns: s.columns.filter((c) => c.id !== id) }));
  },

  reorderColumns: async (activeId, overId) => {
    const cols = get().columns;
    const activeIndex = cols.findIndex((c) => c.id === activeId);
    const overIndex = cols.findIndex((c) => c.id === overId);
    if (activeIndex === overIndex) return;

    const reordered = arrayMove(cols, activeIndex, overIndex);

    set({ columns: reordered });

    try {
      await Promise.all(
        reordered.map((col, i) =>
          client
            .collection("columns")
            .update(col.id, { order: (i + 1) * 1000 }),
        ),
      );
    } catch {
      set({ columns: cols });
    }
  },
}));
