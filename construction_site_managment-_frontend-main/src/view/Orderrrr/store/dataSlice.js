import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetAllOrder,
  apiPostOrder,
  apiGetAllOrderDetails,
  apiGetDistributor,
  apiGetItemData,
  apiDispatchOrder,
  apiPutOrder,
} from "../../../services/OorderService";

export const getOrder = createAsyncThunk("order/data/get", async (data) => {
  const response = await apiGetAllOrder(data);
  return response.data;
});

export const postOrder = createAsyncThunk("order/data/post", async (data) => {
  const response = await apiPostOrder(data);
  return response.data;
});

export const putOrder = createAsyncThunk("order/data/put", async (data) => {
  const response = await apiPutOrder(data);
  return response.data;
});

export const getOrderDetails = createAsyncThunk(
  "details/data/get",
  async (data) => {
    const response = await apiGetAllOrderDetails(data);
    return response.data;
  }
);

export const getDistributor = createAsyncThunk(
  "details/data/getDistributor",
  async (data) => {
    const response = await apiGetDistributor(data);
    return response.data;
  }
);

export const getItemData = createAsyncThunk(
  "details/data/getItemData",
  async (data) => {
    const response = await apiGetItemData(data);
    return response.data;
  }
);

export const dispatchOrder = createAsyncThunk(
  "details/data/dispatchOrder",
  async (data) => {
    const response = await apiDispatchOrder(data);
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

const dataSlice = createSlice({
  name: "orderList/data",
  initialState: {
    loading: false,
    orderList: [],
    details: [],
    distributorList: [],
    itemDataList: [],
    tableData: initialTableData,
  },
  reducers: {
    updateProductList: (state, action) => {
      state.orderList = action.payload;
    },
    setTableData: (state, action) => {
      state.tableData = { ...state.tableData, ...action.payload };
    },

    setDispatchQuantity: (state, action) => {
      const { index, quantity } = action.payload;
      const updatedDetails = [...state.details];
      updatedDetails[index].DISPATCH_QUANTITY = quantity;
      state.details = updatedDetails;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload;
        state.tableData.total = action.payload.count;
      })
      .addCase(getOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload.data.map((e) => {
          return {
            ...e,
            DISPATCH_QUANTITY: e.QTY,
          };
        });
        state.tableData.total = action.payload.count;
      })
      .addCase(getOrderDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(getDistributor.fulfilled, (state, action) => {
        state.loading = false;
        state.distributorList = action.payload;
        state.tableData.total = action.payload.count;
      })

      .addCase(getItemData.fulfilled, (state, action) => {
        state.loading = false;
        state.itemDataList = action.payload;
        state.tableData.total = action.payload.count;
      })
      // .addCase(postState.fulfilled, (state, action) => {})
      .addCase(postOrder.fulfilled, (state, action) => {});
  },
});

export const { updateProductList, setTableData, setDispatchQuantity } =
  dataSlice.actions;

export default dataSlice.reducer;
