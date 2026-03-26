import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetAllCategory, apipostCategory, apiUpdateCategory } from "../../../services/CategoryService";

export const getCategory = createAsyncThunk(
  "user/data/getCategory",
  async (data) => {
    const response = await apiGetAllCategory(data);
    return response.data;
  }
);
export const postCategory = createAsyncThunk(
  "user/data/postCategory",
  async (data) => {
    const response = await apipostCategory(data);
    return response.data;
  }
);
export const putCategory = createAsyncThunk(
  "user/data/updateCategory",
  async (data) => {
    const response = await apiUpdateCategory(data);
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
  name: "categoryList/data",
  initialState: {
    loading: true,
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
      .addCase(getCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryList = action.payload;
        state.tableData.total = action.payload.count;
      })
      .addCase(getCategory.rejected, (state) => {
        state.loading = false;
      })
      .addCase(postCategory.fulfilled, (state, action) => {
      })
      .addCase(putCategory.fulfilled, (state, action) => {
      });
  },
});

export const { updateProductList, setTableData, setFilterData } =
  dataSlice.actions;

export default dataSlice.reducer;
