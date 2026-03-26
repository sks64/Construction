import React, { useState, useEffect } from "react";
import { Formik, Field, Form as FormikForm } from "formik";
import * as Yup from "yup";
import {
  Button,
  Row,
  Col,
  Input,
  Form,
  Radio,
  notification,
  Modal,
  Select,
  Table,
} from "antd";
import { DatePicker, Spin, Space } from "antd";
import moment from "moment";
import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import { toggleNewDialog } from "../store/stateSlice";
import {
  getOrder,
  postOrder,
  putOrder,
  getItem,
  getCustomer,
  getOrderDetails,
  apiGetAllCategory,
  getCategory,
} from "../store/dataSlice";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const { Option } = Select;

const OrderForm = () => {
  const [api, contextHolder] = notification.useNotification();
  const [tableData, setTableData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [filteredItemList, setFilteredItemList] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const selectedOrder = useSelector((state) => state.Order.state.selectedOrder);
  const customerList = useSelector(
    (state) => state.Order.data.customerList?.data
  );
  const categoryList = useSelector(
    (state) => state.Order.data.categoryList?.data
  );
  const itemList = useSelector((state) => state.Order.data.itemList?.data);
  //console.log("itemList", itemList);
  const orderList = useSelector((state) => state.Order.data.orderList?.data);

  const orderDetailsList = useSelector(
    (state) => state.Order.data.orderDetailsList?.data
  );
  const [quantityError, setQuantityError] = useState("");
  const [currentStock, setCurrentStock] = useState(0);
  const [itemStocks, setItemStocks] = useState({});

  const getItemName = (itemId) => {
    const item = itemList?.find((item) => item.ID === itemId);
    return item ? item.NAME : itemId;
  };

  const getCurrentStock = (itemId) => {
    const item = itemList?.find((item) => item.ID === itemId);
    const updatedStock = itemStocks[itemId];
    return updatedStock !== undefined
      ? updatedStock
      : item
      ? item.CURRENT_STOCK
      : 0;
  };

  useEffect(() => {
    dispatch(getCustomer());
    dispatch(getItem());
    dispatch(getCategory());
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setEdit(true);
    } else {
      setEdit(false);
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (edit && selectedOrder !== null) {
      dispatch(getOrderDetails({ ORDER_ID: [selectedOrder.ID] }));
    } else {
      dispatch(getOrderDetails());
    }
  }, [edit, selectedOrder]);

  useEffect(() => {
    if (edit && orderDetailsList) {
      const adaptedData = orderDetailsList.map((item) => ({
        id: item.ID,
        itemid: item.ITEM_ID,
        quantity: item.QTY,
        ReceivedQuantity: item.RECEIVED_QTY,
        Rate: item.RATE,
        amount: item.RATE * item.QTY,
        returnStatus: item.RETURN_STATUS,
      }));
      setTableData(adaptedData);
      setLoading(false);
    } else {
      setTableData([]);
      setLoading(false);
    }
  }, [edit, orderDetailsList]);

  const validationSchema = Yup.object().shape({
    SUB_TOTAL: Yup.string().required("Required"),
    ORDER_AMOUNT: Yup.string().required("Required"),
    CUSTOMER_ID: Yup.string().required("Required"),
    CATEGORY_ID: Yup.string(),
    ORDER_TYPE: Yup.string().required("Required"),
    ITEM_ID: Yup.string(),
    CREATED_BY: Yup.string(),
    ORDER_ENDTIME: Yup.string().when("ORDER_TYPE", {
      is: "R",
      then: () => Yup.string().required("Required"),
      otherwise: () => Yup.string().notRequired(),
    }),
  });

  const initialValues = selectedOrder || {
    SUB_TOTAL: "",
    ORDER_AMOUNT: "",
    CUSTOMER_ID: "",
    ORDER_TYPE: "",
    CATEGORY_ID: "",

    ORDER_ENDTIME: "",
    CREATED_BY: "",
    orderDetails: [],
    ORDER_ID: [],
  };

  //console.log("idhar hu me", selectedOrder);
  //console.log("idhar hu me1", orderDetailsList);
  const handleEdit = (index, setFieldValue) => {
    const rowToEdit = tableData[index];
    setEditingIndex(index);
    setFieldValue("ITEM_ID", rowToEdit.itemid);
    setFieldValue("QTY", rowToEdit.quantity);
    setFieldValue("RATE", rowToEdit.Rate);
    
    // Set category and filtered items for the edit
    const item = itemList?.find((i) => i.ID === rowToEdit.itemid);
    if (item) {
      setFieldValue("CATEGORY_ID", item.CATEGORY_ID);
      const filteredItems = itemList.filter(
        (i) => i.CATEGORY_ID === item.CATEGORY_ID
      );
      setFilteredItemList(filteredItems);
    }
    
    setCurrentStock(getCurrentStock(rowToEdit.itemid));
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

  const handleAddOrUpdate = (values, setFieldValue) => {
    if (!values.QTY) {
      setQuantityError("Quantity is required");
      return;
    } else {
      setQuantityError("");
    }

    const item = itemList.find((item) => item.ID === values.ITEM_ID);
    let Rate;
    if (values.ORDER_TYPE === "S") {
      Rate = item.SALE_RATE;
    } else {
      Rate = item.RENT_RATE;
    }

    const newRow = {
      itemid: values.ITEM_ID,
      Rate,
      quantity: parseInt(values.QTY, 10),
      amount: Rate * parseInt(values.QTY, 10),
    };

    const currentStock = getCurrentStock(newRow.itemid);

    if (
      newRow.quantity >
      currentStock +
        (editingIndex !== null ? tableData[editingIndex].quantity : 0)
    ) {
      setQuantityError("Quantity should not be greater than current stock");
      return;
    } else {
      setQuantityError("");
    }

    if (editingIndex !== null) {
      // Editing an existing item
      const updatedTableData = tableData.map((row, index) =>
        index === editingIndex
          ? {
              ...row,
              quantity: newRow.quantity,
              amount: newRow.amount,
            }
          : row
      );

      const updatedItemStocks = { ...itemStocks };
      const editedItem = tableData[editingIndex];
      updatedItemStocks[editedItem.itemid] =
        getCurrentStock(editedItem.itemid) +
        editedItem.quantity -
        newRow.quantity;

      let total = 0;
      updatedTableData.forEach((row) => {
        if (values.ORDER_TYPE === "R") {
          const orderEndTime = dayjs(values.ORDER_ENDTIME);
          const currentDate = dayjs();
          const totalDays =
            Math.max(0, orderEndTime.diff(currentDate, "days")) + 2;
          total += row.amount * totalDays;
        } else {
          total += row.amount;
        }
      });

      if (values.ORDER_TYPE === "R") {
        //console.log("Total of R", total);
      } else {
        //console.log("Total of S", total);
      }

      setFieldValue("ORDER_AMOUNT", total);
      setFieldValue("SUB_TOTAL", total);

      setTableData(updatedTableData);
      setItemStocks(updatedItemStocks);
      setEditingIndex(null); // Reset editing index
    } else {
      // Adding a new item
      const existingItemIndex = tableData.findIndex(
        (row) => row.itemid === newRow.itemid
      );

      if (existingItemIndex !== -1) {
        // Item exists, update its quantity
        const updatedTableData = tableData.map((row, index) =>
          index === existingItemIndex
            ? {
                ...row,
                quantity: row.quantity + newRow.quantity,
                amount: row.amount + newRow.amount,
              }
            : row
        );

        const updatedItemStocks = { ...itemStocks };
        updatedItemStocks[newRow.itemid] =
          getCurrentStock(newRow.itemid) - newRow.quantity;

        let total = 0;
        updatedTableData.forEach((row) => {
          if (values.ORDER_TYPE === "R") {
            const orderEndTime = dayjs(values.ORDER_ENDTIME);
            const currentDate = dayjs();
            const totalDays =
              Math.max(0, orderEndTime.diff(currentDate, "days")) + 2;
            total += row.amount * totalDays;
          } else {
            total += row.amount;
          }
        });

        if (values.ORDER_TYPE === "R") {
          //console.log("Total of R", total);
        } else {
          //console.log("Total of S", total);
        }

        setFieldValue("ORDER_AMOUNT", total);
        setFieldValue("SUB_TOTAL", total);

        setTableData(updatedTableData);
        setItemStocks(updatedItemStocks);
      } else {
        // Item does not exist, add a new item to the table
        setTableData((prevData) => [...prevData, newRow]);

        let total =
          tableData.reduce((acc, row) => acc + row.amount, 0) + newRow.amount;

        if (values.ORDER_TYPE === "R") {
          const orderEndTime = dayjs(values.ORDER_ENDTIME);
          const currentDate = dayjs();
          const totalDays =
            Math.max(0, orderEndTime.diff(currentDate, "days")) + 2;
          total = total * totalDays;
        }

        if (values.ORDER_TYPE === "R") {
          //console.log("Total of R", total);
        } else {
          //console.log("Total of S", total);
        }

        setFieldValue("ORDER_AMOUNT", total);
        setFieldValue("SUB_TOTAL", total);
        setItemStocks((prevStocks) => ({
          ...prevStocks,
          [newRow.itemid]: getCurrentStock(newRow.itemid) - newRow.quantity,
        }));
      }
    }

    // Reset form fields
    setFieldValue("ITEM_ID", "");
    setFieldValue("QTY", "");
    setFieldValue("RATE", "");
    setCurrentStock(0);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const userData = localStorage.getItem("UserData");
    //console.log("UserData:", userData);

    if (!userData) {
      console.error("No UserData found in localStorage");
      return;
    }

    let userDetails;
    try {
      userDetails = JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing UserData:", error);
      return;
    }

    //console.log("userDetails:", userDetails);

    const USERId = userDetails[0]?.USER_ID;
    //console.log("CREATED_BY (EmpId):", USERId);

    if (!USERId) {
      console.error("EMP_ID is undefined");
      return;
    }

    try {
      const formattedData = {
        ...values,
        CREATED_BY: USERId,
        orderDetails: tableData.map((item) => ({
          ITEM_ID: item.itemid,
          QTY: item.quantity,
          RATE: item.Rate,
          RETURN_STATUS: item.returnStatus,
          RECEIVED_QTY: item.ReceivedQuantity,
        })),
      };

      //console.log("Formatted Data:", formattedData);

      const action = edit
        ? await dispatch(putOrder(formattedData))
        : await dispatch(postOrder(formattedData));

      if (action.payload && action.payload.code === 200) {
        dispatch(getOrder());
        dispatch(toggleNewDialog(false));
        api.success({
          message: "Form Submitted Successfully.",
        });
        resetForm();
        setTableData([]); // Clear the table data
      } else {
        const errorMessage = action.payload?.message || action.payload?.error || "Failed to save order.";
        console.error(
          "Error occurred during form submission:",
          errorMessage
        );
        api.error({
          message: "Form Submission Error",
          description: errorMessage,
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      api.error({
        message: "Unexpected Error",
        description: "An unexpected error occurred during form submission.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Formik
        enableReinitialize
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
          resetForm,
        }) => (
          <FormikForm>
            <Row gutter={16}>
              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.CUSTOMER_ID && errors.CUSTOMER_ID
                      ? errors.CUSTOMER_ID
                      : ""
                  }
                  validateStatus={
                    touched.CUSTOMER_ID && errors.CUSTOMER_ID
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Customer</span>
                  <Select
                    name="CUSTOMER_ID"
                    placeholder="Select Customer"
                    value={values.CUSTOMER_ID || null}
                    onChange={(value) => setFieldValue("CUSTOMER_ID", value)}
                    className="!rounded !h-10"
                  >
                    {customerList?.map((customer) => (
                      <Option key={customer.ID} value={customer.ID}>
                        {customer.NAME}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.ORDER_AMOUNT && errors.ORDER_AMOUNT
                      ? errors.ORDER_AMOUNT
                      : ""
                  }
                  validateStatus={
                    touched.ORDER_AMOUNT && errors.ORDER_AMOUNT
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Order Amount</span>
                  <Input
                    name="ORDER_AMOUNT"
                    placeholder="Order Amount"
                    value={values.ORDER_AMOUNT}
                    disabled
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue("SUB_TOTAL", e.target.value);
                    }}
                    onBlur={handleBlur}
                    className="!rounded !h-10"
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.SUB_TOTAL && errors.SUB_TOTAL
                      ? errors.SUB_TOTAL
                      : ""
                  }
                  validateStatus={
                    touched.SUB_TOTAL && errors.SUB_TOTAL ? "error" : undefined
                  }
                >
                  <span className="text-xs">Subtotal</span>
                  <Input
                    name="SUB_TOTAL"
                    placeholder="Subtotal"
                    value={values.SUB_TOTAL}
                    disabled
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="!rounded !h-10"
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.ORDER_TYPE && errors.ORDER_TYPE
                      ? errors.ORDER_TYPE
                      : ""
                  }
                  validateStatus={
                    touched.ORDER_TYPE && errors.ORDER_TYPE
                      ? "error"
                      : undefined
                  }
                >
                  <div className="flex flex-col mt-1.5">
                    <span className="text-xs mb-1.5">Order Type</span>
                    <Radio.Group
                      name="ORDER_TYPE"
                      onChange={(e) =>
                        setFieldValue("ORDER_TYPE", e.target.value)
                      }
                      value={values.ORDER_TYPE}
                      disabled={edit}
                    >
                      <Radio value="S">Sale</Radio>
                      <Radio value="R">On Rent</Radio>
                    </Radio.Group>
                  </div>
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.ORDER_ENDTIME && errors.ORDER_ENDTIME
                      ? errors.ORDER_ENDTIME
                      : ""
                  }
                  validateStatus={
                    touched.ORDER_ENDTIME && errors.ORDER_ENDTIME
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Order Endtime</span>
                  <DatePicker
                    className="!rounded w-full"
                    name="ORDER_ENDTIME"
                    placeholder="Select Date"
                    value={
                      values.ORDER_ENDTIME ? dayjs(values.ORDER_ENDTIME) : null
                    }
                    onChange={(date, dateString) =>
                      setFieldValue("ORDER_ENDTIME", dateString)
                    }
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                    disabled={values.ORDER_TYPE === "S"}
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={25}>
              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.CATEGORY_ID && errors.CATEGORY_ID
                      ? errors.CATEGORY_ID
                      : ""
                  }
                  validateStatus={
                    touched.CATEGORY_ID && errors.CATEGORY_ID
                      ? "error"
                      : undefined
                  }
                >
                  <span className="mb-1">Category Name</span>
                  <Field
                    as={Select}
                    name="CATEGORY_ID"
                    placeholder="CATEGORY"
                    style={{ height: "41px" }}
                    value={values.CATEGORY_ID}
                    onChange={(value) => {
                      setFieldValue("CATEGORY_ID", value);
                      const filteredItems = itemList.filter(
                        (item) => item.CATEGORY_ID === value
                      );
                      setFilteredItemList(filteredItems);
                    }}
                    onBlur={handleBlur}
                    size="small"
                  >
                    {categoryList?.map((category) => (
                      <Option key={category.ID} value={category.ID}>
                        {category.NAME}
                      </Option>
                    ))}
                  </Field>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={values.ITEM_ID && !values.ITEM_ID ? "Required" : ""}
                  validateStatus={
                    values.ITEM_ID && !values.ITEM_ID ? "error" : undefined
                  }
                >
                  <span className="mb-1">Item Name</span>
                  <Field name="ITEM_ID">
                    {({ field, form }) => (
                      <Select
                        {...field}
                        value={field.value || ""}
                        onChange={(value) => {
                          form.setFieldValue("ITEM_ID", value);
                          setCurrentStock(getCurrentStock(value));
                        }}
                        onBlur={form.handleBlur}
                        size="small"
                        style={{ height: "41px" }}
                      >
                        {filteredItemList?.map((item) => (
                          <Option key={item.ID} value={item.ID}>
                            {item.NAME}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={touched.RATE && errors.RATE ? errors.RATE : ""}
                  validateStatus={
                    touched.RATE && errors.RATE ? "error" : undefined
                  }
                >
                  <span className="text-xs">RATE</span>
                  <Input
                    name="RATE"
                    placeholder="RATE"
                    value={
                      values.ORDER_TYPE === "S"
                        ? itemList?.find((item) => item.ID === values.ITEM_ID)
                            ?.SALE_RATE
                        : itemList?.find((item) => item.ID === values.ITEM_ID)
                            ?.RENT_RATE
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="!rounded !h-10"
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={touched.QTY && errors.QTY ? errors.QTY : ""}
                  validateStatus={
                    touched.QTY && errors.QTY ? "error" : undefined
                  }
                >
                  <span className="text-xs">Quantity</span>
                  <Input
                    name="QTY"
                    placeholder="Quantity"
                    value={values.QTY}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="!rounded !h-10"
                  />
                  {quantityError && (
                    <div className="text-red-500 text-xs">{quantityError}</div>
                  )}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item className="flex flex-col">
                  <span className="text-xs">Current Stock</span>
                  <Input
                    name="CURRENT_STOCK"
                    placeholder="Current Stock"
                    value={currentStock}
                    disabled
                    className="!rounded !h-10"
                  />
                </Form.Item>
              </Col>

              <Col span={2} className="flex items-center">
                <Button
                  type="primary"
                  onClick={() => handleAddOrUpdate(values, setFieldValue)}
                  className="!rounded"
                >
                  {editingIndex !== null ? "Update" : "+"}
                </Button>
              </Col>
            </Row>
            <div style={{ position: "relative" }}>
              {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75">
                  <Spin size="large" />
                </div>
              )}
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
                    title: "Item",
                    dataIndex: "itemid",
                    key: "itemid",
                    render: (itemid) => getItemName(itemid),
                  },

                  {
                    title: "Rate",
                    dataIndex: "Rate",
                    key: "RATE",
                  },

                  {
                    title: "Quantity",
                    dataIndex: "quantity",
                    key: "quantity",
                  },

                  {
                    title: "Amount",
                    dataIndex: "amount",
                    key: "amount",
                    // render: (amount, record) => record.Rate * record.quantity,
                  },
                ]}
                pagination={false}
                className="mt-4"
                bordered
              />
            </div>

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
export default OrderForm;
