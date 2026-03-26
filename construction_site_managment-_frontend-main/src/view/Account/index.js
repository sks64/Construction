import React, { useState,useEffect } from "react";
import { Button, Modal } from "antd";
import { FaUser } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";

import { injectReducer } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { toggleNewDialog, setSelectedAccount } from "./store/stateSlice";
import Accountreducer from "./store";
import { getAccount } from "./store/dataSlice";
import AccountForm from "./components/AccountForm";
import AccountTable from "./components/AccountTable";

injectReducer("account", Accountreducer);
const Account = () => {
  const dialog = useSelector((state) => state.account.state.newDialog);
  const selectedAccount = useSelector((state) => state.account.state.selectedAccount);
  const dispatch = useDispatch();
  const onDialog = () => {
    dispatch(setSelectedAccount(null));
    dispatch(toggleNewDialog(true));
  };
  const handleRefresh = () => {
    dispatch(getAccount());
  };
  useEffect(() => {
    handleRefresh();
  }, [dispatch]);
  const handleCloseModal = () => {
    dispatch(toggleNewDialog(false)); // Close the modal
  };
  return (
    <>
      <div className="bg-white m-4 p-8 rounded-xl">
        <div className="flex justify-between mb-6">
          <div className="text-xl font-bold !text-[#414141]">Account</div>
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
            <p>Add Account</p>
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
                {selectedAccount?'Edit Account' : 'Add New Account'}
              </span>
            }
            open={dialog}
            footer={null}
            style={{ top: "3%" }}
            onCancel={handleCloseModal}
          >
            <AccountForm handleRefresh={handleRefresh} />
          </Modal>
        </div>
        <AccountTable handleRefresh={handleRefresh} />
      </div>
    </>
  );
};

export default Account;
