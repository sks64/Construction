import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Select } from "antd";
import { FaUser } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";
import EmployeeForm from "./Components/EmployeeForm";
import { FaFilter } from "react-icons/fa";
import EmployeeTable from "./Components/EmployeeTable";
import { injectReducer } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { toggleNewDialog, setSelectedEmployee } from "./store/stateSlice";
import { AiFillFileExcel } from "react-icons/ai";
import {
  getEmployee,
  getBranchId,
  getDepartmentId,
  getOrganisation,
  getDesignationId,
} from "./store/dataSlice";
import EmployeeCard from "./Components/EmployeeCard";
import Employeereducer from "./store";
import * as XLSX from "xlsx";
import EmployeeSearch from "./Components/EmployeeSearch";

injectReducer("employee", Employeereducer);

const Employee = () => {
  const tableRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEmployee());
    dispatch(getBranchId());
    dispatch(getOrganisation());
    dispatch(getDepartmentId());
    dispatch(getDesignationId());
  }, [dispatch]);

  const [showFilter, setShowFilter] = useState(false);
  const selectedEmployee = useSelector(
    (state) => state.employee.state.selectedEmployee?.data
  );

  const [filters, setFilters] = useState({
    ORG_ID: null,
    DEPARTMENT_ID: null,
    BRANCH_ID: null,
    DESIGNATION_ID: null,
  });

  const organisationList = useSelector(
    (state) => state.employee.data.organisationList?.data
  );
  const departmentIdList = useSelector(
    (state) => state.employee.data.departmentIdList.data
  );
  const branchIdList = useSelector(
    (state) => state.employee.data.branchIdList.data
  );
  const designationIdList = useSelector(
    (state) => state.employee.data.designationIdList.data
  );
  const dialog = useSelector((state) => state.employee.state.newDialog);
  const allData = useSelector(
    (state) => state.employee.data.employeeList?.data
  );
  //console.log("allData", allData);

  const filterOption = (input, option) => {
    const optionText = option.children;
    return (typeof optionText === "string" ? optionText : optionText.join(""))
      .toLowerCase()
      .includes(input.toLowerCase());
  };

  const exportToExcel = () => {
    if (allData && allData.length > 0) {
      // Map through allData to transform the data as needed
      const transformedData = allData.map(
        ({
          ID,
          BRANCH_ID,
          CLOUD_ID,
          DEPARTMENT_ID,
          DESIGNATION_ID,
          DEVICE_ID,
          EMPLOYEE_TYPE,
          EXPERIENCE_LETTER,
          IS_ADMIN,
          OFFER_LETTER,
          ORG_ID,
          PASSWORD,
          PASSWORD_RESETTED_EMP_ID,
          PROFILE_PHOTO,
          RELIVING_LETTER,
          REPORTING_HEAD_ID,
          ROLE_ID,
          SALARY_SLIP,
          SEQ_NO,
          STATE_ID,
          TEMPORARY_HEAD_ID,
          WCLOUD_ID,
          FIRST_NAME,
          MIDDLE_NAME,
          LAST_NAME,
          STATUS,
          EMPLOYEE_CODE,
          GENDER,
          EMAIL_ID,
          AADHAR_NO,
          MOBILE_NO,
          REPORTING_HEAD_NAME,
          TEMPORARY_HEAD_NAME,
          ORGANISATION_NAME,
          DEPARTMENT_NAME,
          EMPLOYEE_TYPE_NAME,
          BRANCH_NAME,
          DOB,
          ADDRESS,
          CITY,
          DOJ,

          DESIGNATION,
          ...rest
        }) => ({
          Employee_Code: EMPLOYEE_CODE.trim(),
          Name: `${FIRST_NAME} ${MIDDLE_NAME} ${LAST_NAME}`.trim(),
          Designation: DESIGNATION.trim(),
          Email: EMAIL_ID,
          Aadhar: AADHAR_NO,
          Mobile: MOBILE_NO,
          Reporting_Head: REPORTING_HEAD_NAME,
          Temporary_Head: TEMPORARY_HEAD_NAME,
          Organisation_Name: ORGANISATION_NAME,
          Department_Name: DEPARTMENT_NAME,
          Employee_Type: EMPLOYEE_TYPE_NAME,
          Branch_Name: BRANCH_NAME,
          Gender: GENDER === "F" ? "Female" : GENDER === "M" ? "Male" : GENDER,
          Date_of_Birth: DOB,
          Address: ADDRESS,
          City: CITY,
          Date_of_Joining: DOJ,
        })
      );

      const ws = XLSX.utils.json_to_sheet(transformedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "employee_data.xlsx");
    } else {
      //console.log("No data available to export");
    }
  };

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  const handleChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  const handleSubmit = (filters) => {
    dispatch(getEmployee(filters));
  };

  const onDialog = () => {
    dispatch(setSelectedEmployee(null));
    dispatch(toggleNewDialog(true));
  };

  const handleRefresh = () => {
    dispatch(getEmployee());
  };

  useEffect(() => {
    handleRefresh();
  }, [dispatch]);

  useEffect(() => {
    dispatch(getOrganisation());
    dispatch(getDepartmentId());
    dispatch(getDesignationId());
    dispatch(getBranchId());
  }, [dispatch]);

  const handleCloseModal = () => {
    dispatch(toggleNewDialog(false));
  };

  return (
    <>
      <div className="bg-white m-4 p-8 rounded-xl">
        <EmployeeCard />
        <div className="flex justify-between my-8">
          <div className="text-xl font-bold !text-[#414141]">Employee</div>
          <div className="flex">
            <div className="flex items-center">
              <div
                className="bg-[#096CAE] p-[9px] rounded text-xl mr-2 text-white cursor-pointer"
                onClick={exportToExcel}
              >
                <AiFillFileExcel />
              </div>

              <div
                className="bg-[#096CAE] p-[11.5px] rounded mr-4 text-white cursor-pointer"
                onClick={handleFilterClick}
              >
                <FaFilter />
              </div>
              <EmployeeSearch />
              <Button
                style={{
                  backgroundColor: "#096CAE",
                  color: "#ffff",
                  display: "flex",
                  padding: "18px",
                  borderRadius: "6px",
                }}
                onClick={onDialog}
              >
                <LuPlus />
                <p>Add Employee</p>
              </Button>
            </div>
          </div>
          <Modal
            title={
              <span
                style={{
                  color: "#096CAE",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaUser className="mr-2" />
                {selectedEmployee ? "Edit Employee" : "Add New Employee"}
              </span>
            }
            open={dialog}
            width={800}
            footer={null}
            style={{ top: "3%" }}
            onCancel={handleCloseModal}
          >
            <EmployeeForm handleRefresh={handleRefresh} />
          </Modal>
        </div>
        <div className="filter mb-4">
          {showFilter && (
            <div className="p-4 bg-white rounded border border-dashed">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="col-span-4 md:col-span-1">
                  <label className="block mb-1 font-semibold text-gray-500">
                    ORGANISATION
                  </label>
                  <div>
                    <Select
                      showSearch
                      filterOption={filterOption}
                      mode="multiple"
                      className="w-full h-11"
                      placeholder="Select Organisation"
                      onChange={(value) => handleChange("ORG_ID", value)}
                    >
                      {organisationList?.map((type) => (
                        <Select.Option key={type.ID} value={type.ID}>
                          {type.ORGANISATION}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-1">
                  <label className="block mb-1 font-semibold text-gray-500">
                    DEPARTMENT
                  </label>
                  <div>
                    <Select
                      showSearch
                      filterOption={filterOption}
                      mode="multiple"
                      className="w-full h-11"
                      placeholder="Select Department"
                      onChange={(value) => handleChange("DEPARTMENT_ID", value)}
                    >
                      {departmentIdList?.map((type) => (
                        <Select.Option key={type.ID} value={type.ID}>
                          {type.DEPARTMENT}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-1">
                  <label className="block mb-1 font-semibold text-gray-500">
                    BRANCH
                  </label>
                  <div>
                    <Select
                      showSearch
                      filterOption={filterOption}
                      mode="multiple"
                      className="w-full h-11"
                      placeholder="Select Branch"
                      onChange={(value) => handleChange("BRANCH_ID", value)}
                    >
                      {branchIdList?.map((type) => (
                        <Select.Option key={type.ID} value={type.ID}>
                          {type.NAME}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-1">
                  <label className="block mb-1 font-semibold text-gray-500">
                    DESIGNATION
                  </label>
                  <div>
                    <Select
                      showSearch
                      filterOption={filterOption}
                      mode="multiple"
                      className="w-full h-11"
                      placeholder="Select Designation"
                      onChange={(value) =>
                        handleChange("DESIGNATION_ID", value)
                      }
                    >
                      {designationIdList?.map((type) => (
                        <Select.Option key={type.ID} value={type.ID}>
                          {type.DESIGNATION}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-end mb-4 mt-6">
                <div className="flex">
                  <Button
                    type="default"
                    className="mr-4 py-4 px-6 border border-blue-500"
                    onClick={() => {
                      setFilters({
                        ORG_ID: null,
                        DEPARTMENT_ID: null,
                        BRANCH_ID: null,
                        DESIGNATION_ID: null,
                      });
                      setShowFilter(false);
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    type="primary"
                    className="py-4 px-6"
                    onClick={() => {
                      handleSubmit(filters);
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <EmployeeTable />
      </div>
    </>
  );
};

export default Employee;
