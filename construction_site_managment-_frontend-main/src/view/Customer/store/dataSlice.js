import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetAllCustomer, apipostCustomer, apiputCustomer,apiGetAllOrder,apiGetPaymentDetails ,apiGetAddPaymentDetails, apiDeleteCustomer} from "../../../services/CustomerService";

export const getCustomer = createAsyncThunk(
  "customer/data/getCustomer",
  async (data) => {
    const response = await apiGetAllCustomer(data);
    return response.data;
  }
);
export const getOrder = createAsyncThunk(
  "Order/data/getOrder",
  async (data) => {
    const response = await apiGetAllOrder(data);
    return response.data;
  }
);
export const AddPaymentDetails = createAsyncThunk(
  "Order/data/Addpayment",
  async (data) => {
    const response = await apiGetAddPaymentDetails(data);
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
export const postCustomer = createAsyncThunk(
  "customer/data/postCustomer",
  async (data) => {
    const response = await apipostCustomer(data);
    return response.data;
  }
);
export const putCustomer = createAsyncThunk(
  "customer/data/updateCustomer",
  async (data) => {
    const response = await apiputCustomer(data);
    return response.data;
  }
);
export const deleteCustomer = createAsyncThunk(
  "customer/data/deleteCustomer",
  async (data) => {
    const response = await apiDeleteCustomer(data);
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
  name: "customerList/data",
  initialState: {
    loading: true,
    customerList: [],
    orderList:[],
    paymentList:[],
    tableData: initialTableData,
    paymentData:paymentData,
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
    setpaymentTableData: (state, action) => {
      state.paymentData = { ...state.paymentData, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerList = action.payload;
        state.tableData.total = action.payload.count;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload;
        
        state.tableData.total = action.payload.count;
      })
      .addCase(AddPaymentDetails.fulfilled, (state, action) => {
       
        state.loading = false;
        state.paymentList = action.payload;
      })
       
      .addCase(GetPaymentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentList = action.payload;
        state.paymentData.total = action.payload.count;
      })
      .addCase(postCustomer.fulfilled, (state, action) => {
      })
      .addCase(putCustomer.fulfilled, (state, action) => {
      });
  },
});

export const { updateProductList, setTableData, setFilterData } =
  dataSlice.actions;

export default dataSlice.reducer;
