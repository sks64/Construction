import React, { useState, useEffect } from "react";
import { Button, Modal, Drawer } from "antd";
import { FaUser } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";
import { injectReducer } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleNewDialog,
  setSelectedCustomer,
  togglefourthDialog,
  setSelectedfourthOrder,
} from "./store/stateSlice";
import { getCustomer } from "./store/dataSlice";
import Customerreducer from "./store";
import CustomerForm from "./Components/CustomerForm";
import CustomerTable from "./Components/CustomerTable";
import OrderPayment from "./Components/OrderPayment";

injectReducer("customer", Customerreducer);

const Customer = () => {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.customer.state.newDialog);
  const selectedProduct = useSelector(
    (state) => state.customer.state.selectedCustomer
  );
  const dialogfourth = useSelector(
    (state) => state.customer.state.fourthDialog
  );
  const selectedfourthOrder = useSelector(
    (state) => state.customer.state.selectedfourthOrder
  );

  const onDialog = () => {
    dispatch(setSelectedCustomer(null));
    dispatch(toggleNewDialog(true));
  };

  const handleRefresh = () => {
    dispatch(getCustomer());
  };

  useEffect(() => {
    handleRefresh();
  }, [dispatch]);

  const handleCloseModal = () => {
    dispatch(toggleNewDialog(false)); // Close the modal
  };

  const handleClosesecondModal = () => {
    dispatch(togglefourthDialog(false)); // Close the drawer
  };

  return (
    <>
      <div className="bg-white m-4 p-8 rounded-xl">
        <div className="flex justify-between mb-6">
          <div className="text-xl font-bold !text-[#414141]">Customer</div>
          <div className="flex">
            <div className="flex items-center">
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
                <p>Add Customer</p>
              </Button>
            </div>
          </div>
        </div>
        <CustomerTable handleRefresh={handleRefresh} />
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
              {selectedProduct ? "Edit Customer" : "Add New Customer"}
            </span>
          }
          open={dialog}
          footer={null}
          style={{ top: "3%" }}
          onCancel={handleCloseModal}
        >
          <CustomerForm handleRefresh={handleRefresh} />
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
              Transaction Details
            </span>
          }
          open={dialogfourth}
          onClose={handleClosesecondModal}
          width="100%"
        >
          <OrderPayment
            handleRefresh={handleRefresh}
            isDrawerOpen={dialogfourth} // Pass drawer state as a prop
          />
        </Drawer>
      </div>
    </>
  );
};

export default Customer;
