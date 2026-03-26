import { createSlice } from "@reduxjs/toolkit";
const stateSlice = createSlice({
  name: "orderList/state",
  initialState: {
    deleteConfirmation: false,
    selectedOrder: "",
    newDialog: false,
  },
  reducers: {
    toggleDeleteConfirmation: (state, action) => {
      state.deleteConfirmation = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    toggleNewDialog: (state, action) => {
      state.newDialog = action.payload;
    },
  },
});

export const { toggleDeleteConfirmation, setSelectedOrder, toggleNewDialog } =
  stateSlice.actions;

export default stateSlice.reducer;
