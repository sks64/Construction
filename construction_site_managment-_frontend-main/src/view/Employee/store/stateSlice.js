import { createSlice } from "@reduxjs/toolkit";

const stateSlice = createSlice({
  name: "employeeList/state",
  initialState: {
    deleteConfirmation: false,
    selectedEmployee: "",
    newDialog: false,
    filterDialog: false,
  },
  reducers: {
    toggleDeleteConfirmation: (state, action) => {
      state.deleteConfirmation = action.payload;
    },
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
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
  setSelectedEmployee,
  toggleNewDialog,
  toggleFilterDialog,
} = stateSlice.actions;

export default stateSlice.reducer;
