import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import { apiGetMenu } from "../../../services/MenuService";

// export const getMenu = createAsyncThunk("menu/data/get", async (data) => {
//   const response = await apiGetMenu(data);
//   return response.data;
// });

const dataSlice = createSlice({
  name: "menuList/data",
  initialState: {
    loading: false,
    menuList: [],
  },
  reducers: {
    updateProductList: (state, action) => {
      state.menuList = action.payload;
    },
    setTableData: (state, action) => {
      state.tableData = { ...state.tableData, ...action.payload };
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getMenu.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.menuList = action.payload;
  //     })
  //     .addCase(getMenu.pending, (state, action) => {
  //       state.loading = true;
  //     })
  //     .addCase(getMenu.rejected, (state, action) => {
  //       state.loading = false;
  //     });
  // },
});

export const { updateProductList, setTableData } = dataSlice.actions;

export default dataSlice.reducer;
