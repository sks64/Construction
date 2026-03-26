import { createSlice } from "@reduxjs/toolkit";

const stateSlice = createSlice({
  name: "CategoryList/state",
  initialState: {
    deleteConfirmation: false,
    selectedCategory: "",
    newDialog: false,
    filterDialog: false,
  },
  reducers: {
    toggleDeleteConfirmation: (state, action) => {
      state.deleteConfirmation = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    toggleNewDialog: (state, action) => {
      state.newDialog = action.payload;
    },
    toggleFilterDialog: (state, action) => {
      state.filterDialog = action.payload;
    },
  },
});

export const {
  toggleDeleteConfirmation,
  setSelectedCategory,
  toggleNewDialog,
  toggleFilterDialog,
} = stateSlice.actions;

export default stateSlice.reducer;
