import React, { useEffect, useState } from "react";
import { Button, Drawer, Modal } from "antd";
import { FaUser, FaSearch, FaFilter } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";
import DistributorForm from "./Components/DistributorForm";
import DistributorTable from "./Components/DistributorTable";
import DistributorSearch from "./Components/DistributorSearch";
import { injectReducer } from "../../store";
import Distributorreducer from "./store";
import { useSelector, useDispatch } from "react-redux";
import { toggleNewDialog, setSelectedDistributor } from "./store/stateSlice";
import { getDistributor, getState } from "./store/dataSlice";
injectReducer("distributor", Distributorreducer);

const Distributor = () => {
  const dialog = useSelector((state) => state.distributor.state.newDialog);
  const selectedDistributor = useSelector(
    (state) => state.distributor.state.selectedDistributor
  );
  const dispatch = useDispatch();

  const onDialog = () => {
    dispatch(setSelectedDistributor(null));
    dispatch(toggleNewDialog(true));
    dispatch(getState());
  };

  const handleCloseModal = () => {
    dispatch(toggleNewDialog(false));
  };

  const handleRefresh = () => {
    dispatch(getDistributor());
  };

  useEffect(() => {
    handleRefresh();
  }, [dispatch]);

  return (
    <>
      <div className="bg-white m-4 p-8 rounded-xl">
        <div className="flex justify-between mb-6">
          <div className="text-xl font-bold !text-[#414141]">Distributors</div>
          <div className="flex">
            <div className="flex items-center">
              <DistributorSearch />
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
                <p>Add Distributor</p>
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
                {selectedDistributor
                  ? "Edit Distributor"
                  : "Add New Distributor"}
              </span>
            }
            open={dialog}
            onClose={handleCloseModal}
            width="100%"
          >
            <DistributorForm />
          </Drawer>
        </div>
        <DistributorTable handleRefresh={handleRefresh} />
      </div>
    </>
  );
};

export default Distributor;
