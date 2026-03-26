import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetAllEmployee,
  apipostEmployee,
  apiputEmployee,
  apiGetAllOrganisation,
  apiGetAllEmployeeId,
  apiGetAllDepartmentId,
  apiGetAllRoleId,
  apiGetAllDesignationId,
  apiGetAllBranchId,
  apiGetAllStateId,
  apiGetAllEmployeeType,
  apiGetCalenderData,
} from "../../../services/EmployeeService";

export const getEmployee = createAsyncThunk(
  "employee/data/getEmployee",
  async (data) => {
    const response = await apiGetAllEmployee(data);
    return response.data;
  }
);
export const getEmployeeType = createAsyncThunk(
  "employee/data/getEmployeeType",
  async (data) => {
    const response = await apiGetAllEmployeeType(data);
    return response.data;
  }
);

export const getEmployeeId = createAsyncThunk(
  "employee/data/getEmployeeId",
  async (data) => {
    const response = await apiGetAllEmployeeId(data);
    return response.data;
  }
);
export const getDepartmentId = createAsyncThunk(
  "department/data/getDepartmentId",
  async (data) => {
    const response = await apiGetAllDepartmentId(data);
    return response.data;
  }
);
export const getDesignationId = createAsyncThunk(
  "designation/data/getDesignationId",
  async (data) => {
    const response = await apiGetAllDesignationId(data);
    return response.data;
  }
);
export const getRoleId = createAsyncThunk(
  "role/data/getRoleId",
  async (data) => {
    const response = await apiGetAllRoleId(data);
    return response.data;
  }
);
export const getBranchId = createAsyncThunk(
  "branch/data/getBranchId",
  async (data) => {
    const response = await apiGetAllBranchId(data);
    return response.data;
  }
);
export const getStateId = createAsyncThunk(
  "state/data/getStateId",
  async (data) => {
    const response = await apiGetAllStateId(data);
    return response.data;
  }
);
export const getOrganisation = createAsyncThunk(
  "organisation/data/getOrganisation",
  async (data) => {
    const response = await apiGetAllOrganisation(data);
    return response.data;
  }
);
export const postEmployee = createAsyncThunk(
  "employee/data/postEmployee",
  async (data) => {
    const response = await apipostEmployee(data);
    return response;
  }
);

export const putEmployee = createAsyncThunk(
  "employee/data/putEmployee",
  async (data) => {
    const response = await apiputEmployee(data);
    return response;
  }
);
export const getCalenderData = createAsyncThunk(
  "employee/data/getCalenderData",
  async (data) => {
    const response = await apiGetCalenderData(data);
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
  name: "employeeList/data",
  initialState: {
    loading: false,
    employeeIdList: [],
    employeeList: [],
    organisationList: [],
    departmentIdList: [],
    designationIdList: [],
    stateIdList: [],
    branchIdList: [],
    roleIdList: [],
    employeeTypeList: [],
    calenderDataList: [],
    tableData: initialTableData,
    filterData: initialFilterData,
  },
  reducers: {
    updateProductList: (state, action) => {
      state.employeeList = action.payload;
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
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeList = action.payload;
        state.tableData.total = action.payload.count;
      })
      .addCase(getEmployee.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getEmployee.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getEmployeeId.fulfilled, (state, action) => {
        state.employeeIdList = action.payload;
      })
      .addCase(getOrganisation.fulfilled, (state, action) => {
        state.organisationList = action.payload;
      })
      .addCase(getDepartmentId.fulfilled, (state, action) => {
        state.departmentIdList = action.payload;
      })
      .addCase(getDesignationId.fulfilled, (state, action) => {
        state.designationIdList = action.payload;
      })
      .addCase(getRoleId.fulfilled, (state, action) => {
        state.roleIdList = action.payload;
      })
      .addCase(getBranchId.fulfilled, (state, action) => {
        state.branchIdList = action.payload;
      })
      .addCase(getStateId.fulfilled, (state, action) => {
        state.stateIdList = action.payload;
      })
      .addCase(postEmployee.fulfilled, (state, action) => {})
      .addCase(putEmployee.fulfilled, (state, action) => {})
      .addCase(getEmployeeType.fulfilled, (state, action) => {
        state.employeeTypeList = action.payload;
      })
      .addCase(getCalenderData.fulfilled, (state, action) => {
        state.calenderDataList = action.payload;
      });
  },
});

export const { updateProductList, setTableData, setFilterData } =
  dataSlice.actions;

export default dataSlice.reducer;
