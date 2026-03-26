import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetAllAccount,apipostAccount,apiputAccount,apiGetAllGroup } from "../../../services/AccountService";

export const getAccount = createAsyncThunk(
  "account/data/getAccount",
  async (data) => {
    const response = await apiGetAllAccount(data);
    return response.data;
  }
);
export const postAccount = createAsyncThunk(
  "account/data/postAccount",
  async (data) => {
    const response = await apipostAccount(data);
    return response;
  }
);
export const putAccount = createAsyncThunk(
  "account/data/putAccount",
  async (data) => {
    const response = await apiputAccount(data);
    return response;
  }
);
export const getGroup = createAsyncThunk(
    "account/data/getGroup",
    async (data) => {
        const response = await apiGetAllGroup(data);
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
  name: "accountList/data",
  initialState: {
    loading: false,
    accountList: [],
    groupList: [],
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
      .addCase(getAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accountList = action.payload;
      })
      .addCase(getAccount.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAccount.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(postAccount.fulfilled, (state, action) => {})
      .addCase(putAccount.fulfilled, (state, action) => {})
      .addCase(getGroup.fulfilled, (state, action) => {
        state.groupList = action.payload;
      })
  },
});

export const { updateProductList, setTableData, setFilterData } =
  dataSlice.actions;

export default dataSlice.reducer;
