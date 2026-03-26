import React, { useEffect, useCallback, useState } from "react";
import { Table, Select, Spin } from "antd";
import { FaRegEdit, FaEye } from "react-icons/fa";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { getDistributor, setTableData } from "../store/dataSlice";
import { useNavigate } from "react-router-dom";
import { setSelectedDistributor, toggleNewDialog } from "../store/stateSlice";

const { Option } = Select;
const DistributorTable = ({ handleRefresh }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { pageIndex, pageSize, total } = useSelector(
    (state) => state.distributor.data.tableData
  );

  const fetchData = useCallback(() => {
    setLoading(true);
    dispatch(getDistributor({ pageIndex, pageSize }));
    setLoading(false);
  }, [pageIndex, pageSize]);

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, handleRefresh]);

  const data = useSelector(
    (state) => state.distributor.data.distributorList.data
  );

  const onEdit = (record) => {
    dispatch(setSelectedDistributor(record));
    dispatch(toggleNewDialog(true));
  };
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    // //console.log(current);
    dispatch(setTableData({ pageIndex: current, pageSize: pageSize }));
  };

  const columns = [
    {
      title: <span className="text-gray-500">Action</span>,
      dataIndex: "action",
      fixed: "left",
      align: "center",
      width: 110,
      render: (_, record) => (
        <div className="flex justify-between px-2">
          <span
            onClick={() => onEdit(record)}
            className="text-xl text-[#096CAE] cursor-pointer"
          >
            <FaRegEdit />
          </span>
          <span
            onClick={() => navigate("/cart")}
            className="text-xl text-[#096CAE] cursor-pointer"
          >
            <HiOutlineShoppingCart />
          </span>
        </div>
      ),
    },
    {
      title: <span className="text-gray-500">Distributor Firm Name</span>,
      dataIndex: "DISTRIBUTOR_FIRM_NAME",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Owner Name</span>,
      dataIndex: "OWNER_NAME",
      width: 240,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Distributor Firm Details</span>,
      dataIndex: "DISTRIBUTOR_FIRM_DETAILS",
      width: 200,
      render: (text) => {
        let displayText;

        if (text === "P") {
          displayText = "Partnership";
        } else if (text === "L") {
          displayText = "Limited";
        } else if (text === "PL") {
          displayText = "Private Limited";
        }
        return <span className="text-gray-500 font-medium">{displayText}</span>;
      },
    },
    {
      title: <span className="text-gray-500">State Name</span>,
      dataIndex: "STATE_NAME",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">GST No.</span>,
      dataIndex: "GST_NO",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Food Licence Number</span>,
      dataIndex: "FOOD_LICENCE_NUMBER",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Shop Act Licence Number</span>,
      dataIndex: "SHOP_ACT_LICENCE_NUMBER",
      width: 200,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Godown</span>,
      dataIndex: "GODOWN",
      width: 100,
      render: (text) => {
        let displayText;

        if (text === "O") {
          displayText = "Own";
        } else if (text === "R") {
          displayText = "Rent";
        }
        return <span className="text-gray-500 font-medium">{displayText}</span>;
      },
    },
    {
      title: <span className="text-gray-500">Godown Area</span>,
      dataIndex: "GODOWN_AREA",
      width: 150,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Godown Address</span>,
      dataIndex: "GODOWN_ADDRESS",
      width: 200,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Salesman</span>,
      dataIndex: "SALESMAN",
      width: 120,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Driver Boy</span>,
      dataIndex: "DELIVERY_BOY",
      width: 120,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Driver</span>,
      dataIndex: "DRIVER",
      width: 100,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Current Vehicles</span>,
      dataIndex: "CURRENT_VEHICLES",
      width: 150,
      render: (text) => {
        let displayText;

        if (text === "T") {
          displayText = "Two Wheeler";
        } else if (text === "F") {
          displayText = "Four Wheeler";
        } else if (text === "T,F" || text === "F,T") {
          displayText = "Two Wheeler, Four Wheeler";
        }

        return <span className="text-gray-500 font-medium">{displayText}</span>;
      },
    },
    {
      title: <span className="text-gray-500">Current Working Area</span>,
      dataIndex: "CURRENT_WORKING_AREA",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Current Total Routes</span>,
      dataIndex: "CURRENT_TOTAL_ROUTES",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Current Total Shops</span>,
      dataIndex: "CURRENT_TOTAL_SHOPS",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Mobile No.</span>,
      dataIndex: "MOBILE_NO",
      width: 120,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <div className="w-full flex justify-center h-80 items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ marginBottom: "16px" }}>
          <Table
            columns={columns}
            dataSource={data}
            bordered
            scroll={{ x: 1300 }}
            pagination={{
              current: pageIndex,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20],
              onShowSizeChange: handleTableChange,
            }}
            onChange={handleTableChange}
          />
        </div>
      )}
    </>
  );
};

export default DistributorTable;
