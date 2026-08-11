import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const STORAGE_KEY = "gh_selected_exam_ids";

function loadPersisted(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function persist(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

interface ExamFilterState {
  selectedExamIds: string[];
}

const initialState: ExamFilterState = {
  selectedExamIds: loadPersisted(),
};

const examFilterSlice = createSlice({
  name: "examFilter",
  initialState,
  reducers: {
    setSelectedExamIds(state, action: PayloadAction<string[]>) {
      state.selectedExamIds = action.payload;
      persist(action.payload);
    },
    toggleExamId(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.selectedExamIds = state.selectedExamIds.includes(id)
        ? state.selectedExamIds.filter((existing) => existing !== id)
        : [...state.selectedExamIds, id];
      persist(state.selectedExamIds);
    },
    clearSelectedExamIds(state) {
      state.selectedExamIds = [];
      persist([]);
    },
  },
});

export const { setSelectedExamIds, toggleExamId, clearSelectedExamIds } = examFilterSlice.actions;
export default examFilterSlice.reducer;
