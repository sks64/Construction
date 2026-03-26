import React, { useState } from "react";
import { Button, Input, Table } from "antd";
import { setDispatchQuantity } from "../store/dataSlice";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { postOrder, dispatchOrder } from "../store/dataSlice";

// const calculateTax = (orderDetails) => {
//   const totalAmount = orderDetails.reduce((acc, item) => acc + item.AMOUNT, 0);

//   const averageSGST =
//     orderDetails.reduce((acc, item) => acc + item.SGST, 0) /
//     orderDetails.length;
//   const averageCGST =
//     orderDetails.reduce((acc, item) => acc + item.CGST, 0) /
//     orderDetails.length;

//   const formattedSubtotal =
//     totalAmount +
//     (totalAmount * averageSGST) / 100 +
//     (totalAmount * averageCGST) / 100;
//   formattedSubtotal = formattedSubtotal.toFixed(2);

//   const orderData = orderDetails.map((item) => ({
//     ITEM_ID: item.ITEM_ID,
//     QTY: item.QTY,
//     AMOUNT: item.AMOUNT,
//     SGST: averageSGST,
//     CGST: averageCGST,
//   }));

//   return {
//     totalAmount,
//     formattedSubtotal,
//     orderData,
//   };
// };

const DispatchTable = ({ data, handleCancel }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [driverNumber, setDriverNumber] = useState("");
  const [vehicleNumber, setVehicleNUmber] = useState("");

  const [api, contextHolder] = notification.useNotification();
  const { record } = location.state;
  //console.log("record", record);
  //console.log("order2", data);

  // useEffect(() => {
  //   dispatch(getItemData());
  // }, [dispatch]);

  const handleDispatchOrder = async () => {
    const dispatchQuantities = data.map((item) => item.DISPATCH_QUANTITY);
    const remainingDetails = [];

    const orderData = data.map((item, index) => {
      const dispatchQuantity = dispatchQuantities[index];
      const remainingQuantity = item.QTY - dispatchQuantity;

      if (remainingQuantity > 0) {
        remainingDetails.push({
          ITEM_ID: item.ITEM_ID,
          QTY: remainingQuantity,
          CGST: item.CGST,
          IGST: item.IGST,
          SGST: item.SGST,
          AMOUNT: remainingQuantity * item.RATE,
        });
      }

      return {
        ITEM_ID: item.ITEM_ID,
        QTY: dispatchQuantity,
        AMOUNT: dispatchQuantity * item.RATE,
        SGST: item.SGST,
        CGST: item.CGST,
      };
    });

    //console.log("orderData", orderData);
    //console.log("remainingDetails", remainingDetails);

    const totalAmount = orderData.reduce((acc, item) => acc + item.AMOUNT, 0);
    const totalSGST = data.reduce((acc, item) => acc + item.SGST, 0);
    const totalCGST = data.reduce((acc, item) => acc + item.CGST, 0);
    const averageSGST = totalSGST / data.length;
    const averageCGST = totalCGST / data.length;

    let formattedSubtotal =
      totalAmount +
      (totalAmount * averageSGST) / 100 +
      (totalAmount * averageCGST) / 100;
    formattedSubtotal = formattedSubtotal.toFixed(2);

    const remainingTotalAmount = remainingDetails.reduce(
      (acc, item) => acc + item.AMOUNT,
      0
    );
    let remainingFormattedSubtotal =
      remainingTotalAmount +
      (remainingTotalAmount * averageSGST) / 100 +
      (remainingTotalAmount * averageCGST) / 100;
    remainingFormattedSubtotal = remainingFormattedSubtotal.toFixed(2);

    const action = await dispatch(
      dispatchOrder({
        ID: record.ID,
        DISTRIBUTOR_ID: record.DISTRIBUTOR_ID,
        TOTAL_AMOUNT: totalAmount,
        SUB_TOTAL: formattedSubtotal,
        orderDetails: orderData,
        REMAINING_TOTAL_AMOUNT: remainingTotalAmount,
        REMAINING_SUB_TOTAL: remainingFormattedSubtotal,
        remainingDetails: remainingDetails,
        DRIVER_NO: driverNumber,
        VEHICLE_NO: vehicleNumber,
      })
    );

    if (action.payload.code === 200) {
      api.success({
        message: "Order Dispatched Successfully",
      });
      navigate("/order");
    } else {
      api.error({
        message: "Dispatch Failed",
        description: "There was an error dispatching the order.",
      });
    }
  };
  const dispatch = useDispatch();
  const columns = [
    {
      title: "Product",
      dataIndex: "ITEM_NAME",
      width: 250,
      render: (text) => (
        <span className="text-gray-500 font-semibold">{text}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "CATEGORY_NAME",
      width: 250,
      render: (text) => (
        <span className="text-gray-500 font-semibold">{text}</span>
      ),
    },

    {
      title: "Quantity",
      dataIndex: "QTY",
      width: 160,

      render: (text) => (
        <span className="text-gray-500 font-semibold">{text}</span>
      ),
    },
    {
      title: "Dispatch Quantity",
      dataIndex: "DISPATCH_QUANTITY",
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) =>
            dispatch(setDispatchQuantity({ index, quantity: e.target.value }))
          }
          className="w-full rounded"
        />
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <div className="flex justify-start mt-4 gap-2">
        <div className=" w-full mb-8">
          <div
            className="flex w-full gap-8 p-4 border-dotted border-2 border-gray-400 rounded bg-light-gray"
            style={{ backgroundColor: "#F7F7F7" }}
          >
            <div className="mb-4 w-full">
              <label>Driver Number</label>
              <Input
                className="w-full h-10"
                onChange={(e) => {
                  setDriverNumber(e.target.value);
                }}
              />
            </div>

            <div className="w-full">
              <label>Vehicle Number</label>
              <Input
                className="w-full h-10"
                onChange={(e) => {
                  setVehicleNUmber(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Table columns={columns} dataSource={data} pagination={false} bordered />

      <div className="flex justify-end mt-4">
        <Button onClick={handleCancel} className="mr-2">
          Cancel
        </Button>
        <Button type="primary" onClick={handleDispatchOrder}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default DispatchTable;
