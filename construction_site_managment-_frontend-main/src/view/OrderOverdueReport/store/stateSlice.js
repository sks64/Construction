import { createSlice } from "@reduxjs/toolkit";

const stateSlice = createSlice({
  name: "reportsList/state",
  initialState: {
    reportDialog: false,
    selectedReport: "",
  },
  reducers: {
    toggleReportDialog: (state, action) => {
      state.reportDialog = action.payload;
    },
    setSelectedReport: (state, action) => {
      state.selectedReport = action.payload;
    },
  },
});

export const { toggleReportDialog, setSelectedReport } = stateSlice.actions;

export default stateSlice.reducer;
