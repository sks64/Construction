import { createSlice } from "@reduxjs/toolkit";

const stateSlice = createSlice({
  name: "orderList/state",
  initialState: {
    deleteConfirmation: false,
    selectedOrder: "",
    selectedPayment: "",
    newDialog: false,
    secondDialog: false,
    filterDialog: false,
    viewOrderDialog: false,
    viewOrderData: "",

    selectedSecondOrder: "",
    SelectedThirdOrder: "",
  },
  reducers: {
    toggleDeleteConfirmation: (state, action) => {
      state.deleteConfirmation = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setselectedPayment: (state, action) => {
      state.selectedPayment = action.payload;
    },

    toggleNewDialog: (state, action) => {
      state.newDialog = action.payload;
    },
    toggleSecondDialog: (state, action) => {
      state.secondDialog = action.payload;
    },

    setViewOrderDialog: (state, action) => {
      state.viewOrderDialog = action.payload;
    },

    setViewOrderData: (state, action) => {
      state.viewOrderData = action.payload;
    },




    toggleFilterDialog: (state, action) => {
      state.filterDialog = action.payload;
    },

    setSelectedSecondOrder: (state, action) => {
      state.selectedSecondOrder = action.payload;
    },
    setSelectedThirdOrder: (state, action) => {
      state.selectedSecondOrder = action.payload;
    },
  },
});


export const {
  setViewOrderDialog,
  setViewOrderData,
  toggleDeleteConfirmation,
  setSelectedOrder,
  setSelectedThirdOrder,
  setselectedPayment,
  toggleFilterDialog,
  toggleNewDialog,
  toggleSecondDialog,
  setSelectedSecondOrder,
} = stateSlice.actions;

export default stateSlice.reducer;
