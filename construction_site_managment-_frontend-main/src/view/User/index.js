import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { FaUser } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";
import { injectReducer } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { toggleNewDialog, setSelectedUser } from "./store/stateSlice";
import { getUser } from "./store/dataSlice";
import UserForm from "./Components/UserForm";
import UserTable from "./Components/UserTable";
import Userreducer from "./store";
import UserSerch from "./Components/UserSearch";




injectReducer("user", Userreducer);
const User = () => {
    const dialog = useSelector((state) => state.user.state.newDialog);
    const selectedProduct = useSelector((state) => state.user.state.selectedUser);
    const dispatch = useDispatch();
    const onDialog = () => {
        dispatch(setSelectedUser(null));
        dispatch(toggleNewDialog(true));
    };
    const handleRefresh = () => {
        dispatch(getUser());
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
                    <div className="text-xl font-bold !text-[#414141]">User</div>
                    <div className="flex">
                        <div className="flex items-center">
                            <UserSerch />
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
                                <p>Add User</p>
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
                                {selectedProduct ? 'Edit User' : 'Add New User'}
                            </span>
                        }
                        open={dialog}
                        footer={null}
                        style={{ top: "3%" }}
                        onCancel={handleCloseModal}
                    >
                        <UserForm />
                    </Modal>
                </div>
                <UserTable />
            </div>
        </>
    );
};

export default User;
