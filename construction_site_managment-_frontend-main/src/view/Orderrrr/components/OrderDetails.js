import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Tag, Button, Modal, Input, Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, putOrder } from "../store/dataSlice";
import { notification } from "antd";
import { MdEdit } from "react-icons/md";
import EditOrderForm from "./OrderDetailForm";
import { PlusOutlined } from "@ant-design/icons";
import { toggleNewDialog, setSelectedOrder } from "../store/stateSlice";
import { FaUser } from "react-icons/fa";
import DispatchTable from "./DipatchTable";

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  const { record } = location.state;
  const orderDetails = useSelector((state) => state.order.data.details);

  //console.log("record", record);
  const dialog = useSelector((state) => state.order.state.newDialog);
  //console.log(orderDetails);

  const [isRejectVisible, setIsRejectVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});
  const [isDispatched, setIsDispatched] = useState(false);
  const [rejectedRemark, setRejectedRemark] = useState("");

  const [isDispatchModalVisible, setIsDispatchModalVisible] = useState(false);

  const userData = JSON.parse(localStorage.getItem("UserData"));
  const EMP_ID = userData[0].EMP_ID;

  useEffect(() => {
    if (record?.ID) {
      dispatch(getOrderDetails({ ORDER_ID: [record.ID] }));
    }
  }, [dispatch, record]);

  useEffect(() => {
    if (record?.CURRENT_STAGE === "GP") {
      setIsDispatched(true);
    }
  }, [record]);

  if (!record) {
    navigate("/order");
  }

  const handleConfirmOrder = async () => {
    const ROLE_ID = parseInt(localStorage.getItem("ROLE_ID"), 10);

    let newStage = "";
    let additionalData = {};

    if (ROLE_ID === 6) {
      newStage = "BD";
      additionalData = { APPROVED_BY_SD: EMP_ID };
    } else if (ROLE_ID === 7) {
      newStage = "AD";
      additionalData = { APPROVED_BY_BD: EMP_ID };
    } else if (ROLE_ID === 8) {
      newStage = "D";
      additionalData = { APPROVED_BY_AD: EMP_ID };
    } else if (ROLE_ID === 9) {
      additionalData = { DISPATCHED_BY: EMP_ID };
    } else {
      api.error({
        message: "Invalid Role",
        description: "You do not have permission to confirm this order.",
      });
      return;
    }

    const action = await dispatch(
      putOrder({
        ID: record.ID,
        ORDER_STATUS: "A",
        CURRENT_STAGE: newStage,
        ...additionalData,
      })
    );

    //console.log(action);
    if (action.payload.code === 200) {
      api.success({
        message: "Updated Successfully",
      });
      navigate("/order");
    } else {
      api.error({
        message: "Update Failed",
        description: "There was an error updating the order.",
      });
    }
  };

  const handleDeliveredOrder = async () => {
    const action = await dispatch(
      putOrder({
        ID: record.ID,
        ORDER_STATUS: "C",
        CURRENT_STAGE: "DD",
      })
    );

    if (action.payload.code === 200) {
      api.success({
        message: "Updated Successfully",
      });
      navigate("/order");
    }
  };

  const handleCancelOrder = async (remark) => {
    try {
      const action = await dispatch(
        putOrder({
          ID: record.ID,
          ORDER_STATUS: "R",
          REJECTED_BY_EMP: EMP_ID,
          REJECTED_REMARK: remark,
        })
      );

      //console.log(action);
      if (action.payload && action.payload.code === 200) {
        api.success({
          message: "Order Rejected Successfully",
        });
        navigate("/order");
      } else {
        api.error({
          message: "Order Rejection Failed",
          description:
            action.payload?.message ||
            "There was an error rejecting the order.",
        });
      }
    } catch (error) {
      api.error({
        message: "Error",
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  // const handleDispatchOrder = async () => {
  //   const action = await dispatch(
  //     postOrder({
  //       ID: record.ID,
  //       ORDER_STATUS: "A",
  //       CURRENT_STAGE: "GP",
  //     })
  //   );

  //   if (action.payload.code === 200) {
  //     api.success({
  //       message: "Order Dispatched Successfully",
  //     });
  //     navigate("/order");
  //   } else {
  //     api.error({
  //       message: "Dispatch Failed",
  //       description: "There was an error dispatching the order.",
  //     });
  //   }
  // };

  const handleOpenDispatchOrderModal = () => {
    setIsDispatchModalVisible(true);
  };

  const ROLE_ID = parseInt(localStorage.getItem("ROLE_ID"), 10);

  const handleEditClick = (order) => {
    dispatch(setSelectedOrder(order));
    dispatch(toggleNewDialog(false));
  };

  const handleCancel = () => {
    dispatch(toggleNewDialog(false));
    setIsRejectVisible(false);
  };

  const handleRejectOrder = () => {
    setIsRejectVisible(true);
  };

  const handleAddItem = () => {
    dispatch(setSelectedOrder(null));
    dispatch(toggleNewDialog(true));
  };

  const handleCloseModal = () => {
    dispatch(toggleNewDialog(false));
  };

  const handleRejectOk = () => {
    handleCancelOrder(rejectedRemark);
    setRejectedRemark("");
    handleCancel();
  };

  const columns = [
    // ...(ROLE_ID === 1 || ROLE_ID === 2 || (ROLE_ID >= 6 && ROLE_ID <= 9)
    //   ? [
    //       {
    //         title: "Action",
    //         dataIndex: "action",
    //         align: "center",
    //         width: 100,
    //         render: (_, record) => (
    //           <span
    //             onClick={() => handleEditClick(record)}
    //             style={{ cursor: "pointer" }}
    //             className="text-2xl text-[#096CAE] flex items-center justify-center"
    //           >
    //             <MdEdit />
    //           </span>
    //         ),
    //       },
    //     ]
    //   : []),
    {
      title: "Product",
      dataIndex: "ITEM_NAME",
      width: 320,
      render: (text) => (
        <span className="text-gray-500 font-semibold">{text}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "CATEGORY_NAME",
      render: (text) => (
        <span className="text-gray-500 font-semibold">{text}</span>
      ),
    },

    {
      title: "Quantity",
      dataIndex: "QTY",
      render: (text) => (
        <span className="text-gray-500 font-semibold">{text}</span>
      ),
    },
    {
      title: "Price",
      dataIndex: "AMOUNT",
      render: (text) => (
        <span className="text-gray-500 font-semibold">₹{text}</span>
      ),
    },
  ];

  const calculateTaxes = () => {
    if (!orderDetails || orderDetails.length === 0) {
      //console.log("No order details available.");
      return {
        sgst: 0,
        cgst: 0,
        igst: 0,
        averageIGST: 0,
        averageSGST: 0,
        averageCGST: 0,
      };
    }

    let totalAmount = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    let totalCGSTSum = 0;
    let totalSGSTSum = 0;
    let totalIGSTSum = 0;

    // //console.log("Calculating taxes for the following order details:");
    orderDetails.forEach((item, index) => {
      const amount = parseFloat(item.AMOUNT) || 0;
      const cgst = parseFloat(item.CGST) || 0;
      const sgst = parseFloat(item.SGST) || 0;
      const igst = parseFloat(item.IGST) || 0;

      totalAmount += amount;
      totalCGSTSum += cgst;
      totalSGSTSum += sgst;
      totalIGSTSum += igst;

      // //console.log(
      //   `Item ${
      //     index + 1
      //   }: AMOUNT=${amount}, CGST=${cgst}, SGST=${sgst}, IGST=${igst}`
      // );
    });

    const averageCGST = totalCGSTSum / orderDetails.length;
    const averageSGST = totalSGSTSum / orderDetails.length;
    const averageIGST = totalIGSTSum / orderDetails.length;

    // Calculate total taxes
    totalCGST = totalAmount * (averageCGST / 100);
    totalSGST = totalAmount * (averageSGST / 100);
    totalIGST = totalCGST + totalSGST;

    return {
      sgst: totalSGST,
      cgst: totalCGST,
      igst: totalIGST,
      averageIGST: averageSGST + averageCGST,
      averageSGST: averageSGST,
      averageCGST: averageCGST,
    };
  };

  const { sgst, cgst, igst, averageIGST, averageSGST, averageCGST } =
    calculateTaxes();

  //console.log("averageIGST", averageIGST);
  const subTotal =
    orderDetails?.reduce(
      (acc, item) => acc + (parseFloat(item.AMOUNT) || 0),
      0
    ) || 0;
  const grandTotal = subTotal + sgst + cgst;

  const statusMap = {
    R: { text: "Rejected", color: "#ff6b6b", backgroundColor: "#fdfbee" },
    C: { text: "Completed", color: "#82d9b3", backgroundColor: "#dafbf1" },
    P: { text: "Pending", color: "#f3dc93", backgroundColor: "#fdfbee" },
    A: { text: "Approved", color: "#2196f3", backgroundColor: "#bae7ff" },
  };
  const status = statusMap[record.ORDER_STATUS];

  const showConfirmRejectButtons =
    (record.CURRENT_STAGE === "BD" && ROLE_ID >= 7) ||
    (record.CURRENT_STAGE === "AD" && ROLE_ID == 8) ||
    (record.CURRENT_STAGE === "P" && ROLE_ID >= 6);

  const showButtons = record.ORDER_STATUS !== "R";

  const showEditButton =
    (record.CURRENT_STAGE === "BD" &&
      (ROLE_ID === 7 || ROLE_ID === 8 || ROLE_ID === 9)) ||
    (record.CURRENT_STAGE === "AD" &&
      (ROLE_ID === 6 || ROLE_ID === 8 || ROLE_ID === 9)) ||
    (record.CURRENT_STAGE === "P" &&
      (ROLE_ID === 1 ||
        ROLE_ID === 2 ||
        ROLE_ID === 6 ||
        ROLE_ID === 7 ||
        ROLE_ID === 8 ||
        ROLE_ID === 9));

  return (
    <div className="m-4 p-10 bg-white rounded-lg shadow">
      {contextHolder}
      <div className="flex justify-between mb-4">
        <div>
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-zinc-700 mb-1">
              {record.DISTRIBUTOR_NAME}
            </h2>
            <p className="text-zinc-600 ml-2">
              ( {record.ADDRESS} &lt; {record.MOBILE_NO} )
            </p>
          </div>
          <p className="text-zinc-500 mb-1">Order Id: {record.ORDER_NO}</p>
          <p className="text-zinc-500 mb-1">
            Order Date: {record.ORDER_DATE.slice(0, 10)}
          </p>
          <p className="text-zinc-500 mb-1">
            Order Time: {record.ORDER_DATE.slice(11, 19)}
          </p>
        </div>
        <div>
          <Tag
            style={{
              color: status.color,
              backgroundColor: status.backgroundColor,
              padding: "5px 10px",
              borderRadius: "4px",
              fontWeight: "bold",
              border: "none",
            }}
          >
            {status.text}
          </Tag>
        </div>
      </div>
      {(ROLE_ID === 1 || ROLE_ID === 2 || (ROLE_ID >= 6 && ROLE_ID <= 8)) &&
        showEditButton && (
          <div className="flex justify-end">
            <Button
              type="primary"
              onClick={handleAddItem}
              className="mb-4 px-4 py-5 flex items-center"
            >
              <PlusOutlined className="mr-2" />
              Edit Order
            </Button>
          </div>
        )}

      <Table
        dataSource={orderDetails}
        columns={columns}
        pagination={false}
        bordered
      />
      <div className="flex justify-between items-start mt-6">
        <div className="p-4 border rounded-lg w-1/2">
          <h3 className="text-lg font-semibold text-zinc-600 mb-4">
            Payment Summary
          </h3>
          <div className="text-zinc-500 ">
            <p className="flex justify-between mb-2">
              <span className="text-md">Total Item Amount</span>
              <span>₹ {subTotal || 0}</span>
            </p>
            <p className="flex justify-between mb-2">
              <span>SGST ({averageSGST}%)</span>
              <span>₹ {sgst.toFixed(2)}</span>
            </p>
            <p className="flex justify-between mb-2">
              <span>CGST ({averageCGST}%)</span>
              <span>₹ {cgst.toFixed(2)}</span>
            </p>
            {record.STATE_ID === 14 ? (
              <p className="flex justify-between mb-2">
                <span>IGST 0%</span>
                <span>₹0</span>
              </p>
            ) : (
              <p className="flex justify-between mb-2">
                <span>IGST ({averageIGST}%)</span>
                <span>₹ {igst.toFixed(2)}</span>
              </p>
            )}

            <hr />
            <p className="flex justify-between mb-2 mt-2 text-lg">
              <span className="font-semibold">Total</span>
              <span className="text-blue-500 font-semibold">
                ₹ {grandTotal.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
        <div>
          {showButtons && (
            <div className="flex justify-end mt-4">
              {ROLE_ID !== 9 && ROLE_ID !== 10 && showConfirmRejectButtons && (
                <>
                  {record.CURRENT_STAGE !== "DD" && (
                    <Button
                      type="primary"
                      className="mr-2"
                      onClick={handleConfirmOrder}
                    >
                      Confirm Order
                    </Button>
                  )}
                  {record.CURRENT_STAGE !== "DD" && (
                    <Button
                      type="danger"
                      className="border border-blue-500 text-blue-500"
                      onClick={handleRejectOrder}
                    >
                      Reject Order
                    </Button>
                  )}
                </>
              )}
              {ROLE_ID === 9 && record.CURRENT_STAGE !== "GP" && (
                <Button type="default" onClick={handleOpenDispatchOrderModal}>
                  Dispatch Order
                </Button>
              )}

              {ROLE_ID === 10 ? (
                <Button type="default" onClick={handleDeliveredOrder}>
                  Delivered Order
                </Button>
              ) : (
                []
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Reject Order"
        visible={isRejectVisible}
        onOk={handleRejectOk}
        onCancel={handleCancel}
        okText="Reject"
        cancelText="Cancel"
      >
        <Input
          type="text"
          value={rejectedRemark}
          onChange={(e) => setRejectedRemark(e.target.value)}
          placeholder="Enter rejection remark"
        />
      </Modal>

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
            Edit Order
          </span>
        }
        open={dialog}
        onClose={handleCloseModal}
        width="100%"
      >
        <EditOrderForm orderDetails={orderDetails} />
      </Drawer>

      <Modal
        title="Dispatch Order"
        visible={isDispatchModalVisible}
        onCancel={() => setIsDispatchModalVisible(false)}
        okText="Dispatch"
        cancelText="Cancel"
        width={900}
        footer={null}
        style={{ top: "3%" }}
      >
        <DispatchTable
          data={orderDetails}
          handleCancel={() => setIsDispatchModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default OrderDetails;
