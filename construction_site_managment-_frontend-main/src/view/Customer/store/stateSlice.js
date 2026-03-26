import { createSlice } from "@reduxjs/toolkit";

const stateSlice = createSlice({
  name: "customerList/state",
  initialState: {
    deleteConfirmation: false,
    selectedCustomer: "",
    newDialog: false,
    filterDialog: false,
    selectedOrder:'',
    // selectedfifthOrder:'',
  },
  reducers: {
    toggleDeleteConfirmation: (state, action) => {
      state.deleteConfirmation = action.payload;
    },
   
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    toggleNewDialog: (state, action) => {
      state.newDialog = action.payload;
      
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload
  },
    togglefourthDialog: (state, action) => {
      state.fourthDialog = action.payload
  },
    toggleFilterDialog: (state, action) => {
      state.filterDialog = action.payload;
    },
  //   setSelectedfifthOrder: (state, action) => {
  //     state.selectedfourthOrder = action.payload
  // },
  },
});

export const {
  toggleDeleteConfirmation,
  setSelectedCustomer,
  toggleNewDialog,
  toggleFilterDialog,
  setSelectedOrder,
  
 
  togglefourthDialog,
  
} = stateSlice.actions;

export default stateSlice.reducer;
