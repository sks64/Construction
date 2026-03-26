import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { FaUser } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";
import { injectReducer } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { toggleNewDialog, setSelectedItem } from "./store/stateSlice";
import { getItem } from "./store/dataSlice";
import ItemForm from "./Components/ItemForm";
import ItemTable from "./Components/ItemTable";
import Itemreducer from "./store";
import ItemSerch from "./Components/ItemSearch";

injectReducer("item", Itemreducer);
const User = () => {
  const dialog = useSelector((state) => state.item.state.newDialog);
  const selectedProduct = useSelector((state) => state.item.state.selectedItem);
  const dispatch = useDispatch();
  const onDialog = () => {
    dispatch(setSelectedItem(null));
    dispatch(toggleNewDialog(true));
  };
  const handleRefresh = () => {
    dispatch(getItem());
  };
  useEffect(() => {
    handleRefresh();
  }, [dispatch]);
  const handleCloseModal = () => {
    dispatch(toggleNewDialog(false));
  };
  return (
    <>
      <div className="bg-white m-4 p-8 rounded-xl">
        <div className="flex justify-between mb-6">
          <div className="text-xl font-bold !text-[#414141]">Item</div>
          <div className="flex">
            <div className="flex items-center">
              <ItemSerch />
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
                <p>Add Item</p>
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
                {selectedProduct ? "Edit Item" : "Add New Item"}
              </span>
            }
            open={dialog}
            footer={null}
            style={{ top: "3%" }}
            onCancel={handleCloseModal}
          >
            <ItemForm handleRefresh={handleRefresh} />
          </Modal>
        </div>
        <ItemTable />
      </div>
    </>
  );
};

export default User;
