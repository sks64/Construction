import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetAllItem,
  apipostItem,
  apiUpdateItem,
  apiGetAllCategory,
} from "../../../services/ItemService";

export const getItem = createAsyncThunk("user/data/getItem", async (data) => {
  const response = await apiGetAllItem(data);
  return response.data;
});
export const postItem = createAsyncThunk("user/data/postItem", async (data) => {
  const response = await apipostItem(data);
  return response.data;
});
export const putItem = createAsyncThunk(
  "user/data/updateProduct",
  async (data) => {
    const response = await apiUpdateItem(data);
    return response.data;
  }
);

export const getCategory = createAsyncThunk(
  "user/data/getCategory",
  async (data) => {
    const response = await apiGetAllCategory(data);
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
  name: "itemList/data",
  initialState: {
    loading: true,
    itemList: [],
    categoryList: [],
    tableData: initialTableData,
    filterData: initialFilterData,
  },
  reducers: {
    updateProductList: (state, action) => {
      state.branchList = action.payload;
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
      .addCase(getItem.fulfilled, (state, action) => {
        state.loading = false;
        state.itemList = action.payload;
        state.tableData.total = action.payload.count;
      })

      .addCase(getCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryList = action.payload;
        state.tableData.total = action.payload.count;
      })
      .addCase(postItem.fulfilled, (state, action) => {})
      .addCase(putItem.fulfilled, (state, action) => {});
  },
});

export const { updateProductList, setTableData, setFilterData } =
  dataSlice.actions;

export default dataSlice.reducer;
