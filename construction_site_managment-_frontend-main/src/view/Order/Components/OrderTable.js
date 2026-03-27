import React, { useEffect, useCallback, useState } from "react";
import { Table, Drawer, Spin } from "antd";
import { FaEye } from "react-icons/fa";
import { FaRegEdit, FaUser, FaWallet } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { getOrder, GetPaymentDetails, setTableData, getOrderDetailsinvoice } from "../store/dataSlice";
import { setSelectedOrder, toggleNewDialog, setViewOrderData, setViewOrderDialog } from "../store/stateSlice";

import { GrOverview } from "react-icons/gr";
import {
  setSelectedSecondOrder,
  togglesecondDialog,
  setSelectedThirdOrder,
  togglethirdDialog,
} from "../store/stateSlice";
import OrderReturn from "../Components/OrderReturn";
import OrderPayment from "../Components/OrderPayment";
import { GiReturnArrow } from "react-icons/gi";
import { PiContactlessPaymentBold } from "react-icons/pi";

const OrderTable = () => {
  const dispatch = useDispatch();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawer2Visible, setDrawer2Visible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // const selectedOrder = useSelector((state) => state.Order.state.selectedOrder);
  const selectedSecondOrder = useSelector(
    (state) => state.Order.state.selectedSecondOrder
  );
  const tableData = useSelector((state) => state.Order.data.tableData) || {};
  const { pageIndex = 1, pageSize = 10, total = 0 } = tableData;
  //console.log("tableData", tableData);
  const data = useSelector((state) => state.Order.data.orderList?.data) || [];

  const fetchData = useCallback(() => {
    setLoading(true);
    dispatch(getOrder({ pageIndex, pageSize }))
      .finally(() => setLoading(false))
      .catch((error) => {
        console.error("Failed to fetch order data:", error);
        setLoading(false);
      });
  }, [dispatch, pageIndex, pageSize]);

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize]);

  const onEdit = (record) => {
    dispatch(setSelectedOrder(record));
    dispatch(toggleNewDialog(true));
  };


  const onView = async (record) => {
    dispatch(setViewOrderData(record));
    dispatch(setViewOrderDialog(true));
    dispatch(getOrderDetailsinvoice({
      ORDER_ID: [record.ID]
    }));



  };


  const ontransaction = (record) => {
    dispatch(setSelectedSecondOrder(record));
    setDrawer2Visible(true);
  };

  const handleClosePaymentDrawer = () => {
    setDrawer2Visible(false);
    fetchData();
  };

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    dispatch(setTableData({ pageIndex: current, pageSize: pageSize }));
  };

  const handleOpenDrawer = (record) => {
    dispatch(setSelectedOrder(record));
    setDrawerVisible(true);
    // dispatch(toggleNewDialog(true));
  };

  const handleCloseDrawer = () => {
    if (!isSubmitting) {
      //console.log("Drawer closing");
      setDrawerVisible(false);
      // dispatch(setSelectedOrder(null));
      fetchData();
    }
  };

  const columns = [
    {
      title: <span className="text-gray-500">Action</span>,
      dataIndex: "action",
      fixed: "left",
      align: "center",
      width: 160,

      render: (_, record) => (
        <div className="flex justify-between px-2">
          <span
            onClick={() =>
              onView(record)
            }
            className={`text-xl   text-[#096CAE] cursor-pointer mr-2`}
          >
            <FaEye />
          </span>

          <span
            onClick={() =>
              record.ORDER_STATUS === "C" ? undefined : onEdit(record)
            }
            className={`text-xl ${record.ORDER_STATUS === "C"
              ? "text-gray-400 cursor-not-allowed"
              : "text-[#096CAE] cursor-pointer"
              } mr-2`}
          >
            <FaRegEdit />
          </span>
          <span
            onClick={
              record.ORDER_STATUS !== "C"
                ? () => handleOpenDrawer(record)
                : undefined
            }
            className={`text-xl ${record.ORDER_STATUS === "C"
              ? "text-gray-400 cursor-not-allowed"
              : "text-[#096CAE] cursor-pointer"
              } mr-2`}
          >
            <GiReturnArrow />
          </span>
          <span
            onClick={() => ontransaction(record)}
            className="text-xl text-[#096CAE] cursor-pointer"
          >
            <PiContactlessPaymentBold />
          </span>



        </div>
      ),
    },

    {
      title: <span className="text-gray-500">Order No</span>,
      dataIndex: "ORDER_NO",
      width: 180,
      render: (text, record) => {
        const currentDate = new Date();
        const orderEndDate = new Date(record.ORDER_ENDTIME);
        const hasReturnDatetime = !!record.RETURN_DATETIME;
        const isPastEndDateWithoutReturn =
          orderEndDate < currentDate && !hasReturnDatetime;

        return (
          <span
            className={`font-medium ${isPastEndDateWithoutReturn ? "text-red-500" : "text-gray-500"
              }`}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: <span className="text-gray-500">Customer name</span>,
      dataIndex: "CUSTOMER_NAME",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Sub Total</span>,
      dataIndex: "SUB_TOTAL",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Paid Amount</span>,
      dataIndex: "PAID_AMOUNT",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Remaining Amount</span>,
      dataIndex: "REMAINING_AMOUNT",
      width: 180,
      render: (text, record) => {
        const remainingAmount = record.SUB_TOTAL - record.PAID_AMOUNT;
        return (
          <span className="text-gray-500 font-medium">{remainingAmount}</span>
        );
      },
    },
    {
      title: <span className="text-gray-500">Order Date</span>,
      dataIndex: "ORDER_DATETIME",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Order EndDate</span>,
      dataIndex: "ORDER_ENDTIME",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Return Datetime</span>,
      dataIndex: "RETURN_DATETIME",
      width: 180,
      render: (text) =>
        text ? (
          <span className="text-gray-500 font-medium">{text}</span>
        ) : (
          <span className="text-red-500 font-medium">Not Returned</span>
        ),
    },
    // New column to display the overdue days
    {
      title: <span className="text-gray-500">Overdue Days</span>,
      dataIndex: "overdueDays",
      width: 180,
      render: (_, record) => {
        if (record.RETURN_DATETIME) {
          const returnDate = new Date(record.RETURN_DATETIME);
          const currentDate = new Date();
          const differenceInTime = currentDate - returnDate;
          const differenceInDays = Math.floor(
            differenceInTime / (1000 * 3600 * 24)
          );

          // Display overdue days if the order is overdue
          return differenceInDays > 0 ? (
            <span className="text-red-500 font-medium">
              {differenceInDays} days
            </span>
          ) : (
            <span className="text-gray-500 font-medium">On Time</span>
          );
        } else {
          return <span className="text-red-500 font-medium">Not Returned</span>;
        }
      },
    },
    {
      title: <span className="text-gray-800">Order Status</span>,
      dataIndex: "ORDER_STATUS",
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
        } else if (text === "C") {
          style = {
            color: "#82d9b3",
            backgroundColor: "#dafbf1",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Completed";
        } else if (text === "PR") {
          style = {
            color: "#2596be",
            backgroundColor: "#9ddfe6",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Partially Returned";
        }

        return <span style={style}>{displayText}</span>;
      },
    },
    {
      title: <span className="text-gray-800">Payment Status</span>,
      dataIndex: "PAYMENT_STATUS",
      width: 150,
      render: (text) => {
        let style;
        let displayText;

        if (text === "PP") {
          style = {
            color: "#f3dc93",
            backgroundColor: "#fdfbee",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Partially Paid";
        } else if (text === "P") {
          style = {
            color: "#82d9b3",
            backgroundColor: "#dafbf1",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Payment Done";
        } else if (text === "U") {
          style = {
            color: "#ff6b6b",
            backgroundColor: "#ffd5d5",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          };
          displayText = "Unpaid";
        }

        return <span style={style}>{displayText}</span>;
      },
    },
  ];
  //console.log("data", data);
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
            rowKey="ORDER_NO"
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
      )}

      <Drawer
        title={
          <span
            style={{
              color: "#096CAE",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaUser className="mr-2" />
            {/* {selectedOrder ? "Edit Order" : ""} */}
          </span>
        }
        open={drawerVisible}
        onClose={handleCloseDrawer}
        width="100%"
      >
        <OrderReturn setDrawerVisible={setDrawerVisible} />
      </Drawer>

      <Drawer
        title={
          <span
            style={{
              color: "#096CAE",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaUser className="mr-2" />
            {selectedSecondOrder ? "Edit Order" : "Add New Order"}
          </span>
        }
        open={drawer2Visible}
        onClose={handleClosePaymentDrawer}
        width="100%"
      >
        <OrderPayment setDrawer2Visible={setDrawer2Visible} />
      </Drawer>
    </>
  );
};

export default OrderTable;
