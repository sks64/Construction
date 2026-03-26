import { createSlice } from "@reduxjs/toolkit";

const stateSlice = createSlice({
  name: "itemList/state",
  initialState: {
    deleteConfirmation: false,
    selectedItem: "",
    newDialog: false,
    filterDialog: false,
  },
  reducers: {
    toggleDeleteConfirmation: (state, action) => {
      state.deleteConfirmation = action.payload;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
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
  setSelectedItem,
  toggleNewDialog,
  toggleFilterDialog,
} = stateSlice.actions;

export default stateSlice.reducer;
