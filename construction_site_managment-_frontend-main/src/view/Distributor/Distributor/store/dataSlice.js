import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetAllDistributor,
  apipostDistributor,
  apiputDistributor,
  apigetGstType,
  apiGetState,
  apiAgencyMaster,
} from "../../../services/DistributorService";

export const getDistributor = createAsyncThunk(
  "distributor/data/getDistributor",
  async (data) => {
    const response = await apiGetAllDistributor(data);
    return response.data;
  }
);
export const postDistributor = createAsyncThunk(
  "distributor/data/postDistributor",
  async (data) => {
    const response = await apipostDistributor(data);
    //console.log(response);
    return response.data;
  }
);
export const putDistributor = createAsyncThunk(
  "distributor/data/putDistributor",
  async (data) => {
    const response = await apiputDistributor(data);
    //console.log(response);
    return response.data;
  }
);

export const getGstType = createAsyncThunk(
  "distributor/data/gstType",
  async (data) => {
    const response = await apigetGstType(data);
    //console.log(response);
    return response.data;
  }
);

export const getState = createAsyncThunk(
  "distributor/data/state",
  async (data) => {
    const response = await apiGetState(data);
    //console.log(response);
    return response.data;
  }
);

export const getAgencyMAster = createAsyncThunk(
  "distributor/data/agency",
  async (data) => {
    const response = await apiAgencyMaster(data);
    //console.log(response);
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
  name: "distributorList/data",
  initialState: {
    loading: false,
    distributorList: [],
    gstList: [],
    stateList: [],
    agencyList: [],
    tableData: initialTableData,
    filterData: initialFilterData,
  },
  reducers: {
    updateProductList: (state, action) => {
      state.distributorList = action.payload;
    },
    setTableData: (state, action) => {
      state.tableData = { ...state.tableData, ...action.payload };
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDistributor.fulfilled, (state, action) => {
        state.loading = false;
        state.distributorList = action.payload;
        state.tableData.total = action.payload.count;
      })
      .addCase(getDistributor.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDistributor.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(postDistributor.fulfilled, (state, action) => {})
      .addCase(putDistributor.fulfilled, (state, action) => {})

      .addCase(getGstType.fulfilled, (state, action) => {
        state.gstList = action.payload;
      })

      .addCase(getState.fulfilled, (state, action) => {
        state.stateList = action.payload;
      })

      .addCase(getAgencyMAster.fulfilled, (state, action) => {
        state.loading = false;
        state.agencyList = action.payload;
        state.tableData.total = action.payload.count;
      });
  },
});

export const { updateProductList, setTableData, setFilterData } =
  dataSlice.actions;

export default dataSlice.reducer;
