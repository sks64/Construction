import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetAllOrder,
  apipostOrder,
  apiputOrder,
  apigetGstType,
  apiGetCustomer,
  apiGetItem,
  apiGetAllOrderdetails,
  apiGetAllCategory,
  apiOrderReturn,
  apiGetAddPaymentDetails,
  apiGetPaymentDetails,
} from "../../../services/OrderService";
// import { apiGetAllCategory } from "../../../services/CategoryService";
// import { getCustomer } from "../../Customer/store/dataSlice";

export const getOrder = createAsyncThunk(
  "Order/data/getOrder",
  async (data) => {
    const response = await apiGetAllOrder(data);
    return response.data;
  }
);
export const GetPaymentDetails = createAsyncThunk(
  "Order/data/GetPaymentDetails",
  async (data) => {
    const response = await apiGetPaymentDetails(data);
    return response.data;
  }
);
export const AddPaymentDetails = createAsyncThunk(
  "Order/data/Addpayment",
  async (data) => {
    const response = await apiGetAddPaymentDetails(data);
    console.log("response payment", response);
    return response.data;
  }
);
export const getOrderDetails = createAsyncThunk(
  "Order/data/getOrderdetails",
  async (data) => {
    const response = await apiGetAllOrderdetails(data);
    return response.data;
  }
);


export const getOrderDetailsinvoice = createAsyncThunk(
  "Order/data/getOrderDetailsinvoice",
  async (data) => {
    const response = await apiGetAllOrderdetails(data);
    return response.data;
  }
);

export const postOrder = createAsyncThunk(
  "Order/data/postOrder",
  async (data) => {
    const response = await apipostOrder(data);
    //console.log(response);
    return response.data;
  }
);
export const putOrder = createAsyncThunk(
  "Order/data/putOrder",
  async (data) => {
    const response = await apiputOrder(data);
    //console.log(response);
    return response.data;
  }
);
export const getOrderReturn = createAsyncThunk(
  "Order/data/getOrderReturn",
  async (data) => {
    const response = await apiOrderReturn(data);
    //console.log(response);
    return response.data;
  }
);
export const getGstType = createAsyncThunk(
  "Order/data/gstType",
  async (data) => {
    const response = await apigetGstType(data);
    //console.log(response);
    return response.data;
  }
);
export const getCustomer = createAsyncThunk(
  "Order/data/customer",
  async (data) => {
    const response = await apiGetCustomer(data);
    //console.log(response);
    return response.data;
  }
);
export const getCategory = createAsyncThunk(
  "Order/data/getCategory",
  async (data) => {
    const response = await apiGetAllCategory(data);
    return response.data;
  }
);
export const getItem = createAsyncThunk("Order/data/item", async (data) => {
  const response = await apiGetItem(data);
  //console.log(response);
  return response.data;
});

export const initialTableData = {
  total: 0,
  pageIndex: 1,
  pageSize: 10,
};
export const orderreturnTableData = {
  total: 0,
  pageIndex: 1,
  pageSize: 10,
  query: "",
  sort: {
    order: "",
    key: "",
  },
};
export const paymentData = {
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
  name: "orderList/data",
  initialState: {
    loading: false,
    loading2: false,

    subtotal: 0,
    paidAmount: 0,
    orderList: [],
    gstList: [],
    customerList: [],
    invoicedata: [],

    itemList: [],
    categoryList: [],
    orderreturnList: [],
    paymentList: [],
    orderreturnData: orderreturnTableData,
    tableData: initialTableData,
    filterData: initialFilterData,
    paymentData: paymentData,
    details: [],
  },
  reducers: {
    updateProductList: (state, action) => {
      state.distributorList = action.payload;
    },
    setTableData: (state, action) => {
      state.tableData = { ...state.tableData, ...action.payload };
    },
    setorderreturnTableData: (state, action) => {
      state.orderreturnData = { ...state.orderreturnData, ...action.payload };
    },
    setpaymentTableData: (state, action) => {
      state.paymentData = { ...state.paymentData, ...action.payload };
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },
    setDispatchQuantity: (state, action) => {
      const { index, quantity } = action.payload;
      const updatedDetails = [...state.details];
      updatedDetails[index].RECEIVED_QTY = quantity;
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
      .addCase(GetPaymentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentList = action.payload;
        state.paymentData.total = action.payload.count;
      })
      .addCase(getOrder.pending, (state, action) => {
        state.loading = true;
      })

      .addCase(AddPaymentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentList = action.payload;
      })
      .addCase(getOrderReturn.fulfilled, (state, action) => {
        state.loading = false;
        state.orderreturnList = action.payload;
        state.orderreturnData = {
          ...state.orderreturnData,
          total: action.payload.count,
        };
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetailsList = action.payload;
        state.orderDetailsTableData = {
          ...state.orderDetailsTableData,
          total: action.payload.count,
        };
      })

      .addCase(getOrderDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = true;
      })















      .addCase(getOrderDetailsinvoice.fulfilled, (state, action) => {
        state.loading2 = false;
        state.invoicedata = action.payload;

      })
      .addCase(getOrderDetailsinvoice.pending, (state, action) => {
        state.loading2 = true;
      })
      .addCase(getOrderDetailsinvoice.rejected, (state, action) => {
        state.loading2 = true;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(postOrder.fulfilled, (state, action) => { })
      .addCase(putOrder.fulfilled, (state, action) => { })

      .addCase(getGstType.fulfilled, (state, action) => {
        state.gstList = action.payload;
      })

      .addCase(getCustomer.fulfilled, (state, action) => {
        state.customerList = action.payload;
      })
      .addCase(getItem.fulfilled, (state, action) => {
        console.log("Payload for getItem.fulfilled:", action.payload);
        state.itemList = action.payload;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.categoryList = action.payload;
      });
  },
});

export const {
  updateProductList,
  setDispatchQuantity,
  setorderreturnTableData,
  setpaymentTableData,
  setTableData,
  setFilterData,
} = dataSlice.actions;

export default dataSlice.reducer;
