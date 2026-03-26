import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { FaUser } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";
import { injectReducer } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { toggleNewDialog, setSelectedCategory } from "./store/stateSlice";
import { getCategory } from "./store/dataSlice";
import CategoryForm from "./Components/CategoryForm";
import CategoryTable from "./Components/CategoryTable";
import Categoryreducer from "./store";
import CategorySerch from "./Components/CategorySearch";
injectReducer("category", Categoryreducer);
const Category = () => {
    const dialog = useSelector((state) => state.category.state.newDialog);
    const selectedProduct = useSelector((state) => state.category.state.selectedCategory);
    const dispatch = useDispatch();
    const onDialog = () => {
        dispatch(setSelectedCategory(null));
        dispatch(toggleNewDialog(true));
    };
    const handleRefresh = () => {
        dispatch(getCategory());
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
                    <div className="text-xl font-bold !text-[#414141]">Category</div>
                    <div className="flex">
                        <div className="flex items-center">
                            <CategorySerch />
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
                                <p>Add Category</p>
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
                                {selectedProduct ? 'Edit Category' : 'Add New Category'}
                            </span>
                        }
                        open={dialog}
                        footer={null}
                        style={{ top: "3%" }}
                        onCancel={handleCloseModal}
                    >
                        <CategoryForm />
                    </Modal>
                </div>
                <CategoryTable />
            </div>
        </>
    );
};

export default Category;
