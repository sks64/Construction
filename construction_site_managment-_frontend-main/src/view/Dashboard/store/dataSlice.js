import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetAllDashboardCount,
  apigetOrderDatewiseReport,
  apigettopsellingitems,
  apigettopfivecustomers,
  apigetDashboardSaleReport,
} from "../../../services/DashboardService";

export const getDashboardCount = createAsyncThunk(
  "dashboard/data/getDashboardCount",
  async (data) => {
    const response = await apiGetAllDashboardCount(data);
    return response.data;
  }
);
export const getOrderDatewiseReport = createAsyncThunk(
  "dashboard/data/getOrderDatewiseReport",
  async (data) => {
    const response = await apigetOrderDatewiseReport(data);
    return response.data;
  }
);
export const gettopsellingitems = createAsyncThunk(
  "dashboard/data/gettopsellingitems",
  async (data) => {
    const response = await apigettopsellingitems(data);
    return response.data;
  }
);
export const gettopfivecustomers = createAsyncThunk(
  "dashboard/data/gettopfivecustomers",
  async (data) => {
    const response = await apigettopfivecustomers(data);
    return response.data;
  }
);
export const getDashboardSaleReport = createAsyncThunk(
  "dashboard/data/getDashboardSaleReport",
  async (data) => {
    const response = await apigetDashboardSaleReport(data);
    return response.data;
  }
);
export const initialTableData = {
  total: 0,
  pageIndex: 1,
  pageSize: 10,
  query: "",
  sort: {
    order: "",
    key: "",
  },
};

export const initialFilterData = {
  name: "",
  category: ["bags", "cloths", "devices", "shoes", "watches"],
  status: [0, 1, 2],
  productStatus: 0,
};

const dataSlice = createSlice({
  name: "dashboardList/data",
  initialState: {
    loading: false,
    dashboardList: [],
    gstList: [],
    stateList: [],
    datewiseList: [],
    topitemList: [],
    saleList: [],
    topcustomerList: [],
    tableData: initialTableData,
    filterData: initialFilterData,
  },
  reducers: {
    updateProductList: (state, action) => {
      state.dashboardList = action.payload;
    },
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardCount.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardList = action.payload;
        console.log("dashboardList", state.dashboardList);
      })
      .addCase(getDashboardCount.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDashboardCount.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(getOrderDatewiseReport.fulfilled, (state, action) => {
        state.loading = false;
        state.datewiseList = action.payload;
        console.log("dashboardList", state.datewiseList);
      })
      .addCase(getOrderDatewiseReport.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getOrderDatewiseReport.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(gettopsellingitems.fulfilled, (state, action) => {
        state.loading = false;
        state.topitemList = action.payload;
        console.log("dashboardList", state.topitemList);
      })
      .addCase(gettopsellingitems.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(gettopsellingitems.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(gettopfivecustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.topcustomerList = action.payload;
        console.log("dashboardList", state.topcustomerList);
      })
      .addCase(gettopfivecustomers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(gettopfivecustomers.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(getDashboardSaleReport.fulfilled, (state, action) => {
        state.loading = false;
        state.saleList = action.payload;
        console.log("dashboardList", state.saleList);
      })
      .addCase(getDashboardSaleReport.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDashboardSaleReport.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { updateProductList, setTableData, setFilterData } =
  dataSlice.actions;

export default dataSlice.reducer;
