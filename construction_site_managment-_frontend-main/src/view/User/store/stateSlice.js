import { createSlice } from "@reduxjs/toolkit";

const stateSlice = createSlice({
  name: "userList/state",
  initialState: {
    deleteConfirmation: false,
    selectedUser: "",
    newDialog: false,
    filterDialog: false,
  },
  reducers: {
    toggleDeleteConfirmation: (state, action) => {
      state.deleteConfirmation = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
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
  setSelectedUser,
  toggleNewDialog,
  toggleFilterDialog,
} = stateSlice.actions;

export default stateSlice.reducer;
