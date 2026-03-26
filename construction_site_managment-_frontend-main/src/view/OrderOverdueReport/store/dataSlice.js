import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetOverDueOrders,
  apiGetCustomer,
} from "../../../services/OrderOverdueReport";

export const getOverdueOrders = createAsyncThunk(
  "Reports/data/getOverdueOrders",
  async (data) => {
    const response = await apiGetOverDueOrders(data);
    return response.data;
  }
);

export const getCustomer = createAsyncThunk(
  "Reports/data/getCustomer",
  async (data) => {
    const response = await apiGetCustomer(data);
    return response.data;
  }
);

export const initialTableData = {
  total: 0,
  pageIndex: 1,
  pageSize: 10,
};

const dataSlice = createSlice({
  name: "reportsList/data",
  initialState: {
    loading: false,
    reportsList: [],
    customerList: [],
    tableData: initialTableData,
  },
  reducers: {
    setTableData: (state, action) => {
      state.tableData = { ...state.tableData, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOverdueOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.reportsList = action.payload;
        state.tableData.total = action.payload.count;
      })
      .addCase(getOverdueOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOverdueOrders.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerList = action.payload;
        state.tableData.total = action.payload.count;
      })
      .addCase(getCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomer.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setTableData } = dataSlice.actions;

export default dataSlice.reducer;
