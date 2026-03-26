import React, { useState, useEffect } from "react";
import { Formik, Field, Form as FormikForm } from "formik";
import * as Yup from "yup";
import {
  Button,
  Row,
  Col,
  Input,
  Form,
  Select,
  notification,
  Modal,
  Table,
  Tooltip,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toggleNewDialog } from "../store/stateSlice";
import { postOrder, getItemData, getOrderDetails } from "../store/dataSlice";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useLocation } from "react-router-dom";
const { Option } = Select;

const EditOrderForm = ({ orderDetails }) => {
  const [api, contextHolder] = notification.useNotification();
  const [tableData, setTableData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const dispatch = useDispatch();
  // const selectedDistributor = useSelector(
  //   (state) => state.distributor.state.selectedDistributor
  // );
  const location = useLocation();
  const { record } = location.state;
  //console.log(record);
  const validationSchema = Yup.object().shape({
    // QTY: Yup.number()
    //   .typeError("Quantity must be a number")
    //   .required("Quantity is required")
    //   .min(1, "Quantity must be greater than 0"),
  });

  const userData = JSON.parse(localStorage.getItem("UserData"));
  const EMP_ID = userData[0].EMP_ID;

  const initialValues = {
    ID: "",
    TOTAL_AMOUNT: null,
    SUB_TOTAL: null,
    orderDetails: [],
    RATE: "",
    QTY: "",
  };

  const handleEdit = (index, setFieldValue) => {
    const rowToEdit = tableData[index];
    setEditingIndex(index);

    // Set form values for editing
    setFieldValue("ID", rowToEdit.productID);
    setFieldValue("RATE", rowToEdit.rate);
    setFieldValue("QTY", rowToEdit.qty);
    setSelectedRate(rowToEdit.rate);
  };

  const handleDelete = (index) => {
    Modal.confirm({
      title: "Are you sure you want to delete this record?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        const updatedTableData = tableData.filter((_, i) => i !== index);
        setTableData(updatedTableData);
      },
    });
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const totalAmount = tableData.reduce((acc, item) => acc + item.amount, 0);

      // Extract old CGST, SGST, IGST values from orderDetails
      const oldCGST = orderDetails.map((item) => item.CGST).filter(Boolean);
      const oldSGST = orderDetails.map((item) => item.SGST).filter(Boolean);
      const oldIGST = orderDetails.map((item) => item.IGST).filter(Boolean);

      const newItems = tableData.filter((item) => item.isNew); // Replace `isNew` with the actual property indicating new items
      const newCGST = newItems.map((item) => item.cgst).filter(Boolean);
      const newSGST = newItems.map((item) => item.sgst).filter(Boolean);
      const newIGST = newItems.map((item) => item.igst).filter(Boolean);

      const allCGST = [...oldCGST, ...newCGST];
      const allSGST = [...oldSGST, ...newSGST];
      const allIGST = [...oldIGST, ...newIGST];

      const averageCGST = allCGST.length
        ? allCGST.reduce((acc, val) => acc + val, 0) / allCGST.length
        : 0;
      const averageSGST = allSGST.length
        ? allSGST.reduce((acc, val) => acc + val, 0) / allSGST.length
        : 0;
      const averageIGST = allIGST.length
        ? allIGST.reduce((acc, val) => acc + val, 0) / allIGST.length
        : 0;

      const subtotal =
        totalAmount +
        (totalAmount * averageCGST) / 100 +
        (totalAmount * averageSGST) / 100 +
        (totalAmount * averageIGST) / 100;

      const formattedSubtotal = subtotal.toFixed(2);

      const formattedData = {
        ID: record.ID,
        TOTAL_AMOUNT: totalAmount,
        SUB_TOTAL: formattedSubtotal,
        orderDetails: tableData.map((item) => ({
          ITEM_ID: item.productID,
          QTY: item.qty,
          AMOUNT: item.amount,
          CGST: item.cgst || averageCGST,
          SGST: item.sgst || averageSGST,
          IGST: item.igst || averageIGST,
        })),

        EDITED_BY: EMP_ID,
      };

      const action = await dispatch(postOrder(formattedData));

      if (action.payload.code < 300) {
        dispatch(getOrderDetails());
        dispatch(toggleNewDialog(false));
        api.success({
          message: "Form Submitted Successfully.",
        });
      } else {
        console.error(
          "Error occurred during form submission:",
          action.payload.error
        );
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddOrUpdate = (values) => {
    // //console.log("Form values:", values);
    // //console.log("Data list:", data);

    if (!data || !values.ID) {
      //console.log("Data or selected product ID is missing");
      return;
    }

    const selectedProduct = data.find((item) => item.ID === values.ID);

    //console.log("Selected product:", selectedProduct);

    const productName = selectedProduct
      ? selectedProduct.NAME
      : "Unknown Product";
    const newAmount = values.QTY * values.RATE;

    if (editingIndex !== null) {
      const updatedTableData = tableData.map((row, index) =>
        index === editingIndex
          ? {
              ...row,
              qty: values.QTY,
              amount: values.QTY * values.RATE,
              productName: productName,
            }
          : row
      );
      setTableData(updatedTableData);
      setEditingIndex(null);
    } else {
      const existingIndex = tableData.findIndex(
        (row) => row.productID === values.ID
      );

      if (existingIndex !== -1) {
        const updatedTableData = tableData.map((row, index) =>
          index === existingIndex
            ? {
                ...row,
                qty: row.qty + Number(values.QTY),
                amount: (row.qty + Number(values.QTY)) * row.rate,
              }
            : row
        );
        setTableData(updatedTableData);
      } else {
        // Add a new row if item ID does not exist
        const newRow = {
          productID: values.ID,
          productName: productName,
          rate: values.RATE,
          qty: Number(values.QTY),
          amount: newAmount,
        };
        setTableData((prevData) => [...prevData, newRow]);
      }
    }

    values.ID = "";
    values.QTY = "";
    values.RATE = "";
    setSelectedRate("");
  };

  useEffect(() => {
    dispatch(getItemData());
  }, [dispatch]);

  const data = useSelector((state) => state.order.data.itemDataList?.data);
  //console.log("data", data);
  // const orderDetails = useSelector((state) => state.order.data.details.data);
  //console.log("Order Details", orderDetails);

  const adaptOrderDetails = (orderDetails) => {
    return orderDetails.map((detail) => ({
      productID: detail.ITEM_ID,
      productName: detail.ITEM_NAME,
      rate: detail.RATE,
      qty: detail.QTY,
      amount: detail.AMOUNT,
    }));
  };

  //console.log(orderDetails);
  useEffect(() => {
    if (orderDetails) {
      const adaptedData = adaptOrderDetails(orderDetails);
      setTableData(adaptedData);
    }
  }, [orderDetails]);

  const handleProductChange = (value, setFieldValue) => {
    //console.log("Selected value:", value);
    const selectedItem = data.find((item) => item.ID === value);
    //console.log("selectedItem", selectedItem);

    if (selectedItem) {
      setSelectedRate(selectedItem.RATE);
      setFieldValue("RATE", selectedItem.RATE);
      setFieldValue("ID", value);
    }
  };

  return (
    <>
      {contextHolder}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => (
          <FormikForm>
            <Row gutter={16}>
              <Col span={5}>
                <Form.Item className="flex flex-col">
                  <span className="text-xs">Product Name</span>
                  <Select
                    className="h-10 rounded"
                    placeholder="Select a product"
                    value={values.ID || undefined}
                    onChange={(value) =>
                      handleProductChange(value, setFieldValue)
                    }
                  >
                    {data &&
                      data.map((item) => (
                        <Option key={item.ID} value={item.ID}>
                          {item.NAME}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={5}>
                <Form.Item className="flex flex-col">
                  <span className="text-xs">Rate</span>
                  <div className="flex">
                    <Input
                      name="RATE"
                      placeholder="Rate"
                      value={values.RATE || selectedRate}
                      className="!rounded h-10"
                      disabled
                    />
                  </div>
                </Form.Item>
              </Col>

              <Col span={5}>
                <Form.Item
                  className="flex flex-col"
                  help={touched.QTY && errors.QTY ? errors.QTY : ""}
                  validateStatus={
                    touched.QTY && errors.QTY ? "error" : undefined
                  }
                >
                  <span className="text-xs">Quantity</span>
                  <div className="flex">
                    <Input
                      name="QTY"
                      placeholder="Quantity"
                      value={values.QTY}
                      onChange={handleChange}
                      className="!rounded h-10"
                    />
                  </div>
                </Form.Item>
              </Col>

              <Col span={5}>
                <Form.Item className="flex flex-col">
                  <span className="text-xs">Price</span>
                  <div className="flex">
                    <Input
                      name="PRICE"
                      placeholder="Price"
                      value={values.QTY * (values.RATE || selectedRate)}
                      className="!rounded h-10"
                      disabled
                    />
                  </div>
                </Form.Item>
              </Col>

              <Col span={5.9}>
                <Form.Item>
                  <Tooltip title="Click to save">
                    <Button
                      type="primary"
                      shape="circle"
                      icon={
                        <span className="text-xl flex items-center justify-center mb-1">
                          +
                        </span>
                      }
                      onClick={() => handleAddOrUpdate(values)}
                      className="ml-2 mt-5 !w-[40px] !h-[40px]"
                    />
                  </Tooltip>
                </Form.Item>
              </Col>
            </Row>

            <Table
              dataSource={tableData}
              columns={[
                {
                  title: <span className="text-gray-500">Action</span>,
                  dataIndex: "action",
                  fixed: "left",
                  align: "center",
                  width: 100,
                  render: (_, record, index) => (
                    <div className="flex justify-between px-2">
                      <span
                        onClick={() => handleEdit(index, setFieldValue)}
                        className="text-xl text-[#096CAE] cursor-pointer"
                      >
                        <FaRegEdit />
                      </span>
                      <span
                        onClick={() => handleDelete(index)}
                        className="text-xl text-[#096CAE] cursor-pointer"
                      >
                        <RiDeleteBin6Line />
                      </span>
                    </div>
                  ),
                },
                {
                  title: "Product Name",
                  dataIndex: "productName",
                  key: "productName",
                },
                {
                  title: "Rate",
                  dataIndex: "rate",
                  key: "rate",
                },
                {
                  title: "Quantity",
                  dataIndex: "qty",
                  key: "qty",
                },
                {
                  title: "Amount",
                  dataIndex: "amount",
                  key: "amount",
                },
              ]}
              pagination={false}
              className="mt-4"
              bordered
              scroll={{ y: 300 }}
            />
            <div className="flex justify-end mt-4">
              <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                Save and Close
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};

export default EditOrderForm;
