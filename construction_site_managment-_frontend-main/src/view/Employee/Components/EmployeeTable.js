import React, { useEffect, useState, useCallback, useRef } from "react";
import { Button, Table, Pagination, Switch, Modal, Spin, Select } from "antd";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { getEmployee, putEmployee, setTableData } from "../store/dataSlice";
import {
  setSelectedEmployee,
  toggleFilterDialog,
  toggleNewDialog,
} from "../store/stateSlice";
import OfferLetter from "./Offerletter";
import EmployeeCalender from "./EmployeeCalender";
import { FaRegEye, FaFilePdf } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { FaImage, FaRegImage } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const EmployeeTable = ({ handleRefresh }) => {
  const dispatch = useDispatch();
  const offerLetterRef = useRef();
  const [openCalender, setOpenCalender] = useState(false);
  const [offerLetter, setOfferLetter] = useState(false);
  const location = useLocation();
  const loading = useSelector((state) => state.employee.data.loading);
  const [selectedEmployee, setSelectedEmployeeState] = useState(null);
  const [selectedCalender, setSelectedCalender] = useState(null);
  const [filters, setFilters] = useState({
    ORG_ID: null,
    DEPARTMENT_ID: null,
    BRANCH_ID: null,
    DESIGNATION_ID: null,
  });
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const { searchQuery } = location.state || "";

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
  const filterDialog = useSelector(
    (state) => state.employee.state.filterDialog
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { pageIndex, pageSize, total } = useSelector(
    (state) => state.employee.data.tableData
  );
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState("");

  const filterOption = (input, option) => {
    const optionText = option.children;
    return (typeof optionText === "string" ? optionText : optionText.join(""))
      .toLowerCase()
      .includes(input.toLowerCase());
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCalenderOk = () => {
    setOpenCalender(false);
  };
  const handleCancelCalender = () => {
    setOpenCalender(false);
  };

  const isCalenderOpen = () => {
    setOpenCalender(true);
  };

  const fetchData = useCallback(() => {
    const updatedFilters = {
      ...filters,
      pageIndex,
      pageSize,
      SEARCH_FILTER: searchQuery,
    };
    dispatch(getEmployee(updatedFilters));
  }, [filters, pageIndex, pageSize]);

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize]);

  const data = useSelector((state) => state.employee.data.employeeList.data);

  const onEdit = (record) => {
    dispatch(setSelectedEmployee(record));
    dispatch(toggleNewDialog(true));
  };
  const onShow = (record) => {
    setSelectedProfilePhoto(record.PROFILE_PHOTO);
    showModal();
  };
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    dispatch(setTableData({ pageIndex: current, pageSize: pageSize }));
  };

  const onShowCalender = (record) => {
    setSelectedCalender(record.ID);
    isCalenderOpen();
  };

  const handlePrint = useReactToPrint({
    content: () => offerLetterRef.current,
  });

  const onShowPdf = (record) => {
    setSelectedEmployeeState(record); // Store the selected employee
    setOfferLetter(true);
  };

  const onSwitch = async (record) => {
    const updatedRecord = { ...record, STATUS: record.STATUS === 1 ? 0 : 1 };
    await dispatch(putEmployee(updatedRecord));
    dispatch(getEmployee());
  };
  const handleOfferLetterOk = () => {
    handlePrint();
    setOfferLetter(false);
  };

  const handleChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));

    switch (key) {
      case "BRANCH_ID":
        setSelectedBranch(value);
        break;
      case "EMP_ID":
        selectedEmployees(value);
        break;
      case "DEPARTMENT_ID":
        setSelectedDepartment(value);
        break;

      case "ORG_ID":
        setSelectedOrganization(value);
        break;
      case "DESIGNATION_ID":
        setSelectedDesignation(value);
        break;

      default:
        break;
    }
  };

  const handleSubmit = () => {
    const updatedFilters = {
      ...filters,
      pageIndex,
      pageSize,
    };
    dispatch(getEmployee(updatedFilters));
  };

  const handleClear = () => {
    setFilters({
      ORG_ID: null,
      DEPARTMENT_ID: null,
      BRANCH_ID: null,
      DESIGNATION_ID: null,
    });
    setSelectedBranch(null);
    setSelectedEmployees(null);
    setSelectedDepartment(null);
    setSelectedDesignation(null);
    setSelectedOrganization(null);
    dispatch(toggleNewDialog(false));
    dispatch(getEmployee());
  };

  useEffect(() => {
    dispatch(setTableData({ pageIndex: 1, pageSize }));
    dispatch(toggleFilterDialog(false));
  }, [location.pathname, dispatch, pageSize]);

  const columns = [
    {
      title: <span className="text-gray-500">Action</span>,
      dataIndex: "action",
      width: 155,
      fixed: "left",
      render: (_, record) => (
        <>
          <div className="flex items-center">
            <span
              onClick={() => onEdit(record)}
              className="text-2xl text-[#096CAE] cursor-pointer"
            >
              <MdEdit />
            </span>
            <span
              onClick={() => onShow(record)}
              className="text-2xl ml-2 text-red-500 cursor-pointer"
            >
              <FaRegImage />
            </span>

            <span
              onClick={() => onShowCalender(record)}
              className="text-2xl ml-2 text-[#096CAE] cursor-pointer"
            >
              <SlCalender />
            </span>
            <span
              onClick={() => onShowPdf(record)}
              className="text-2xl ml-2 text-[#096CAE] cursor-pointer"
            >
              <FaFilePdf />
            </span>
          </div>
        </>
      ),
    },
    {
      title: <span className="text-gray-500">Employee Name</span>,
      dataIndex: "FIRST_NAME",
      width: 200,
      render: (_, record) =>
        `${record.FIRST_NAME} ${record.MIDDLE_NAME ? record.MIDDLE_NAME : ""} ${record.LAST_NAME ? record.LAST_NAME : ""
        }`,
    },

    {
      title: <span className="text-gray-500">Designation</span>,
      dataIndex: "DESIGNATION",
      width: 150,
    },
    {
      title: <span className="text-gray-500">Email Id</span>,
      dataIndex: "EMAIL_ID",
      width: 250,
    },
    {
      title: <span className="text-gray-500">Mobile No.</span>,
      dataIndex: "MOBILE_NO",
      width: 150,
    },

    {
      title: <span className="text-gray-500">Organization Name</span>,
      dataIndex: "ORGANISATION_NAME",
      width: 250,
    },
    {
      title: <span className="text-gray-500">Department Name</span>,
      dataIndex: "DEPARTMENT_NAME",
      width: 220,
    },
    {
      title: <span className="text-gray-500">Branch</span>,
      dataIndex: "BRANCH_NAME",
      width: 150,
    },

    {
      title: <span className="text-gray-500">Gender</span>,
      dataIndex: "GENDER",
      width: 150,
    },
    {
      title: <span className="text-gray-500">Status</span>,
      dataIndex: "STATUS",
      width: 120,
      render: (text, record) => (
        <Switch
          onChange={() => onSwitch(record)}
          checked={record.STATUS === 1}
        />
      ),
    },
  ];

  return (
    <div className="main-content bg-white">
      <div className="main-content bg-white p-2 rounded-md">
        <div>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Table
              columns={columns}
              dataSource={data}
              onChange={handleTableChange}
              pagination={{
                current: pageIndex,
                pageSize,
                total,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
              }}
              scroll={{ x: 1500, y: 500 }}
            />
          )}
        </div>
        <Modal
          title="Profile Photo"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <img src={selectedProfilePhoto} alt="Profile" />
        </Modal>

        <Modal
          title="Calender"
          open={openCalender}
          onOk={handleCalenderOk}
          onCancel={handleCancelCalender}
          footer={null}
          className="flex justify-center"
          style={{ top: "2%" }}

        >
          <EmployeeCalender selectedCalender={selectedCalender} />
        </Modal>

        <Modal
          open={offerLetter}
          onOk={handleOfferLetterOk}
          onCancel={() => setOfferLetter(false)}
          footer={[
            <Button key="back" onClick={() => setOfferLetter(false)}>
              Cancel
            </Button>,
            <Button key="print" type="primary" onClick={handleOfferLetterOk}>
              Print
            </Button>,
          ]}
          width={1000}
        >
          <OfferLetter ref={offerLetterRef} selectedEmployee={selectedEmployee} />
        </Modal>
      </div>
    </div>
  );
};

export default EmployeeTable;
