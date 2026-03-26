import React from "react";
import { Button, Modal } from "antd";
import OrderTable from "./components/OrderTable";

import { injectReducer } from "../../store";
import Orderreducer from "./store";
import { FaFilter } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleNewDialog } from "./store/stateSlice";
import OrderFilter from "./components/OrderFilter";

injectReducer("order", Orderreducer);

const Order = () => {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.order.state.newDialog);
  const selectedOrder = useSelector(
    (state) => state.order.state.setSelectedOrder
  );

  //console.log(dialog);

  const handleFilterClick = () => {
    if (dialog) {
      dispatch(toggleNewDialog(false));
    } else {
      dispatch(toggleNewDialog(true));
    }
  };

  return (
    <>
      <div className="bg-white m-4 p-8 rounded-xl">
        <div className="flex justify-between mb-6">
          <div className="text-xl font-bold !text-[#414141]">Order</div>
          <div className="flex">
            <div className="flex items-center">
              <div
                className="bg-[#096CAE] p-[11.5px] rounded mr-4 text-white cursor-pointer"
                onClick={handleFilterClick}
              >
                <FaFilter />
              </div>
              {/* <LeaveSearch /> */}
            </div>
          </div>
          {/* <Modal
            title={
              <span
                style={{
                  color: "#096CAE",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaUserEdit className="mr-2" />
                {selectedOrder ? "Edit Order" : "Add New Order"}
              </span>
            }
            open={dialog}
            footer={null}
            style={{ top: "3%" }}
            onCancel={handleCloseModal}
          >
            <DistributorForm />
          </Modal> */}
        </div>
        <OrderFilter />
        <OrderTable />
      </div>
    </>
  );
};

export default Order;
