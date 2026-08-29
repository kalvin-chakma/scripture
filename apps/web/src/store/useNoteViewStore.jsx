import { create } from "zustand";

const useNoteViewStore = create((set) => ({
  isEditing: false,
  setIsEditing: (isEditing) => set({ isEditing }),
  toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),
}));

export default useNoteViewStore;
