import React, { useEffect, useState } from "react";
import { Button, Drawer, Modal } from "antd";
import { FaUser, FaSearch, FaFilter } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";
import OrderForm from "./Components/OrderForm";
import OrderTable from "./Components/OrderTable";
import OrderSearch from "./Components/OrderSearch";
import OrderGSTInvoice from "./Components/OrderGSTInvoice";
import { injectReducer } from "../../store";
import Orderreducer from "./store";
import { useSelector, useDispatch } from "react-redux";
import { toggleNewDialog, setViewOrderDialog, setSelectedOrder } from "./store/stateSlice";
import { toggleFilterDialog, setSelectedSecondOrder } from "./store/stateSlice";
import { getOrder } from "./store/dataSlice";
import OrderFilter from "./Components/OrderFilter";
injectReducer("Order", Orderreducer);

const Order = () => {
  const dialog = useSelector((state) => state.Order.state.newDialog);
  const dialog2 = useSelector((state) => state.Order.state.viewOrderDialog);

  const filterDialog = useSelector((state) => state.Order.state.filterDialog);
  const dialogFirst = useSelector((state) => state.Order.state.firstDialog);
  const selectedOrder = useSelector((state) => state.Order.state.selectedOrder);
  const selectedSecondOrder = useSelector(
    (state) => state.Order.state.selectedSecondOrder
  );
  const dispatch = useDispatch();

  const onDialog = () => {
    dispatch(setSelectedOrder(null));
    dispatch(toggleNewDialog(true));
  };

  const handleCloseModal = () => {
    dispatch(toggleNewDialog(false));
  };
  const handleCloseModal2 = () => {
    dispatch(setViewOrderDialog(false));
  };
  const handleRefresh = () => {
    dispatch(getOrder());
  };

  useEffect(() => {
    handleRefresh();
  }, [dispatch]);

  const handleFilterClick = () => {
    if (filterDialog) {
      dispatch(toggleFilterDialog(false));
    } else {
      dispatch(toggleFilterDialog(true));
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

              <OrderSearch />

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
                <p>Add Order</p>
              </Button>
            </div>
          </div>
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
                {selectedOrder ? "Edit Order" : "Add New Order"}
              </span>
            }
            open={dialog}
            onClose={handleCloseModal}
            width="100%"
          >
            <OrderForm />
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
                View Order
              </span>
            }
            open={dialog2}
            onClose={handleCloseModal2}
            width="100%"
          >
            <OrderGSTInvoice />
          </Drawer>

        </div>
        {filterDialog && <OrderFilter />}
        <OrderTable handleRefresh={handleRefresh} />
      </div>
    </>
  );
};

export default Order;
