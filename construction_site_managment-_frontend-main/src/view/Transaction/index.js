import React, { useEffect } from "react";
import { Button, Modal } from "antd";
import { FaUser } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";
import AssetForm from "./Components/AssetForm";
import AssetTable from "./Components/AssetTable";
import { injectReducer } from "../../store";
import Assetreducer from "./store";
import { useSelector, useDispatch } from "react-redux";
import { toggleNewDialog, setSelectedAsset } from "./store/stateSlice";
import { getAsset } from "./store/dataSlice";
import AssetSearch from "./Components/AssetSearch";

injectReducer("asset", Assetreducer);
const Asset= () => {
  const dialog = useSelector((state) => state.asset.state.newDialog);

  const AddEdit = useSelector((state) => state.asset.state.selectedAsset);
  const aaa = String(dialog);

  const dispatch = useDispatch();
  const onDialog = () => {
    dispatch(setSelectedAsset(null));
    dispatch(toggleNewDialog(true));
  };

  const handleCloseModal = () => {
    dispatch(toggleNewDialog(false)); 
  };


  const handleRefresh = () => {
    dispatch(getAsset());
  };


  useEffect(() => {
    handleRefresh();
  }, [dispatch]);

  return (
    <>
      <div className="bg-white m-4 p-8 rounded-xl">
        <div className="flex justify-between mb-6">
          <div className="text-xl font-bold !text-[#414141]">Transaction Detail</div>
          <div className="flex">
            <div className="flex items-center">
              <AssetSearch />
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
                <p>Add Transaction</p>
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
                {AddEdit ? "Edit Transaction" : "Add New Transaction"}

              </span>
            }
            open={dialog}
            footer={null}
            style={{ top: "3%" }}
            onCancel={handleCloseModal}
          >
            <AssetForm />
          </Modal>
        </div>


        <AssetTable handleRefresh={handleRefresh} />


      </div>
    </>
  );
};

export default Asset;
