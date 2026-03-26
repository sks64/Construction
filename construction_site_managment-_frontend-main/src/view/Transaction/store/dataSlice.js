import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  apiGetAllAsset,
  apipostAsset,
  apiputAsset,
  apiGetAllAssetCategory,
} from "../../../services/AssetService";

export const getAssetCategory = createAsyncThunk(
  "assetCategory/data/getAssetCategory",
  async (data) => {
    const response = await apiGetAllAssetCategory(data);
    return response.data;
  }
);
export const getAsset = createAsyncThunk(
  "asset/data/getAsset",
  async (data) => {
    const response = await apiGetAllAsset(data);
    return response.data;
  }
);
export const postAsset = createAsyncThunk(
  "asset/data/postAsset",
  async (data) => {
    const response = await apipostAsset(data);
    return response.data;
  }
);
export const putAsset = createAsyncThunk(
  "asset/data/putAsset",
  async (data) => {
    const response = await apiputAsset(data);
    ////console.log(response);
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
  name: "assetList/data",
  initialState: {
    loading: false,
    assetList: [],
    categoryList: [],
    tableData: initialTableData,
    filterData: initialFilterData,
  },
  reducers: {
    updateProductList: (state, action) => {
      state.assetList = action.payload;
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
      .addCase(getAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.assetList = action.payload;
        state.tableData.total = action.payload.count;
      })
      .addCase(getAsset.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAsset.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getAssetCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryList = action.payload;
      })

      .addCase(postAsset.fulfilled, (state, action) => {})
      .addCase(putAsset.fulfilled, (state, action) => {});
  },
});

export const { updateProductList, setTableData, setFilterData } =
  dataSlice.actions;

export default dataSlice.reducer;
