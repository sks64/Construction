import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetAllUser, apipostUser, apiUpdateUser, apiDeleteUser } from "../../../services/UserServices";

export const getUser = createAsyncThunk(
  "user/data/getUser",
  async (data) => {
    const response = await apiGetAllUser(data);
    return response.data;
  }
);
export const postUser = createAsyncThunk(
  "user/data/postUser",
  async (data) => {
    const response = await apipostUser(data);
    return response;
  }
);
export const putUser = createAsyncThunk(
  "user/data/updateProduct",
  async (data) => {
    const response = await apiUpdateUser(data);
    return response;
  }
);
export const deleteUser = createAsyncThunk(
  "user/data/deleteUser",
  async (data) => {
    const response = await apiDeleteUser(data);
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
  name: "userList/data",
  initialState: {
    loading: true,
    userList: [],
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
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload;
        state.tableData.total = action.payload.count;
      })
      .addCase(postUser.fulfilled, (state, action) => {
      })
      .addCase(putUser.fulfilled, (state, action) => {
      });
  },
});

export const { updateProductList, setTableData, setFilterData } =
  dataSlice.actions;

export default dataSlice.reducer;
