import React, { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getOrder, setTableData } from "../store/dataSlice";

import { setSelectedOrder, toggleNewDialog } from "../store/stateSlice";
import { MdEdit, MdVisibility } from "react-icons/md";
const OrderTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { pageIndex, pageSize, total } = useSelector(
    (state) => state.order.data.tableData
  );

  const fetchData = useCallback(() => {
    dispatch(getOrder({ pageIndex, pageSize }));
  }, [dispatch, pageIndex, pageSize]);

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize]);

  const data = useSelector((state) => state.order.data.orderList.data);

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;

    dispatch(setTableData({ pageIndex: current, pageSize: pageSize }));
  };

  // const onEdit = (record) => {
  //   dispatch(setSelectedOrder(record));
  //   dispatch(toggleNewDialog(true));
  // };

  const onOrderNumberClick = (record) => {
    navigate("/order/details", { state: { record } });
  };

  const ROLE_ID = parseInt(localStorage.getItem("ROLE_ID"), 10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(getOrder({ pageIndex: 1, pageSize }));

        dispatch(setTableData({ pageIndex: 1, pageSize }));

        dispatch(toggleNewDialog(false));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.pathname, pageSize]);

  const renderActionIcon = (record) => {
    //console.log(ROLE_ID);
    if (ROLE_ID === 1 || ROLE_ID === 2 || (ROLE_ID >= 6 && ROLE_ID <= 9)) {
      return (
        <MdEdit
          onClick={() => onOrderNumberClick(record)}
          style={{ cursor: "pointer", color: "#096CAE" }}
          className="text-2xl"
        />
      );
    } else {
      return (
        <MdVisibility
          onClick={() => onOrderNumberClick(record)}
          style={{ cursor: "pointer", color: "#096CAE" }}
          className="text-2xl"
        />
      );
    }
  };

  const columns = [
    {
      title: <span className="text-gray-500">Action</span>,
      dataIndex: "action",
      fixed: "left",
      align: "center",
      width: 100,
      render: (_, record) => (
        <>
          <div className="flex items-center justify-center">
            {renderActionIcon(record)}
          </div>
        </>
      ),
    },
    {
      title: <span className="text-gray-500">Order No.</span>,
      dataIndex: "ORDER_NO",
      width: 120,
      align: "center",
      render: (text, record) => (
        <span className="text-gray-500 font-semibold">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Retailer Name</span>,
      width: 170,
      dataIndex: "DISTRIBUTOR_NAME",

      render: (text) => (
        <span className="text-gray-500 font-semibold">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Order Date</span>,
      dataIndex: "ORDER_DATE",
      width: 170,

      render: (text) => (
        <span className="text-gray-500 font-semibold">{text}</span>
      ),
    },

    {
      title: <span className="text-gray-500">Order Status</span>,
      dataIndex: "ORDER_STATUS",
      width: 140,

      render: (text) => {
        let style;
        let displayText;

        if (text === "P") {
          style = {
            color: "#f3dc93",
            backgroundColor: "#fdfbee",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Pending";
        } else if (text === "A") {
          style = {
            color: "#2196f3",
            backgroundColor: "#e3f2fd",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Approved";
        } else if (text === "R") {
          style = {
            color: "#ff6b6b",
            backgroundColor: "#fdfbee",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Rejected";
        } else if (text === "C") {
          style = {
            color: "#82d9b3",
            backgroundColor: "#dafbf1",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Completed";
        }

        return <span style={style}>{displayText}</span>;
      },
    },
    {
      title: <span className="text-gray-500">Current Stage</span>,
      dataIndex: "CURRENT_STAGE",
      width: 200,
      render: (text) => {
        let style;
        let displayText;

        if (text === "P") {
          style = {
            color: "#f3dc93",
            backgroundColor: "#fdfbee",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Pending";
        } else if (text === "SD") {
          style = {
            color: "#4caf50",
            backgroundColor: "#e8f5e9",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
            fontSize: "10px",
          };
          displayText = "Sales Division";
        } else if (text === "BD") {
          style = {
            color: "#2196f3",
            backgroundColor: "#e3f2fd",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Bill Department";
        } else if (text === "AD") {
          style = {
            color: "#ff9800",
            backgroundColor: "#fff3e0",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Account Department";
        } else if (text === "D") {
          style = {
            color: "#f3dc93",
            backgroundColor: "#fdfbee",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Dispatch";
        } else if (text === "GP") {
          style = {
            color: "#2196f3",
            backgroundColor: "#bae7ff",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Gate Pass";
        } else if (text === "DD") {
          style = {
            color: "#82d9b3",
            backgroundColor: "#dafbf1",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Delivered";
        }

        return <span style={style}>{displayText}</span>;
      },
    },

    {
      title: <span className="text-gray-500">Rejected By</span>,
      dataIndex: "REJECTED_BY_EMP_NAME",
      width: 170,

      render: (text) => (
        <span className="text-gray-500 font-semibold">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Rejected Remark</span>,
      dataIndex: "REJECTED_REMARK",
      width: 300,

      render: (text) => (
        <span className="text-gray-500 font-semibold">{text}</span>
      ),
    },

    {
      title: <span className="text-gray-500">Total Amount</span>,
      dataIndex: "TOTAL_AMOUNT",
      width: 120,

      render: (text) => (
        <span className="text-gray-500 font-semibold">₹{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Sub Total</span>,
      dataIndex: "SUB_TOTAL",
      width: 120,

      render: (text) => (
        <span className="text-gray-500 font-semibold">₹{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Destination Address</span>,
      dataIndex: "DESTINATION_ADDRESS",
      width: 170,
      render: (text) => (
        <span className="text-gray-500 font-semibold">
          {text ? text : "* Address is not available"}
        </span>
      ),
    },
    {
      title: <span className="text-gray-500">Driver Number</span>,
      dataIndex: "DRIVER_NO",
      width: 170,

      render: (text) => (
        <span className="text-gray-500 font-semibold">
          {text ? text : "* Number is not Available"}
        </span>
      ),
    },
    {
      title: <span className="text-gray-500">GR RR Number</span>,
      dataIndex: "GR_RR_NO",
      width: 170,

      render: (text) => (
        <span className="text-gray-500 font-semibold">
          {text ? text : "* Number is not Available"}
        </span>
      ),
    },
    {
      title: <span className="text-gray-500">Vehicle Number</span>,
      dataIndex: "VEHICLE_NO",
      width: 170,

      render: (text) => (
        <span className="text-gray-500 font-semibold">
          {text ? text : "* Number is not Available"}
        </span>
      ),
    },
    {
      title: (
        <span className="text-gray-500">
          Approved Date Time By Sales Division
        </span>
      ),
      dataIndex: "APPROVED_DATETIME_BY_SD",
      width: 280,

      render: (text) => (
        <span className="text-gray-500 font-semibold">{text}</span>
      ),
    },
    {
      title: (
        <span className="text-gray-500">
          Approved Date Time By Bill Department
        </span>
      ),
      dataIndex: "APPROVED_DATETIME_BY_BD",
      width: 300,

      render: (text) => (
        <span className="text-gray-500 font-semibold">{text}</span>
      ),
    },
    {
      title: (
        <span className="text-gray-500">
          Approved Date Time By Account Department
        </span>
      ),
      dataIndex: "APPROVED_DATETIME_BY_AD",
      width: 325,

      render: (text) => (
        <span className="text-gray-500 font-semibold">{text}</span>
      ),
    },
  ];

  return (
    <>
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
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
          }}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
};

export default OrderTable;
