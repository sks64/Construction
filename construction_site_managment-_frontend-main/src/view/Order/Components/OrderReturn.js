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
import { useDispatch, useSelector } from "react-redux";
import { toggleNewDialog } from "../store/stateSlice";
import { setDispatchQuantity } from "../store/dataSlice";
import {
  getOrder,
  getOrderReturn,
  putOrder,
  getItem,
  getCustomer,
  getOrderDetails,
  apiGetAllCategory,
  getCategory,
} from "../store/dataSlice";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Spin } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const OrderReturn = ({ setDrawerVisible, onResetInnerTableData, values }) => {
  const [api, contextHolder] = notification.useNotification();
  const [orderreturnTableData, setorderreturnTableData] = useState([]);

  const [setReceivedQuantity] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dueCharges, setDueCharges] = useState(0);

  const dispatch = useDispatch();
  const selectedOrder = useSelector((state) => state.Order.state.selectedOrder);

  //console.log("selected oreder", selectedOrder);
  const customerList = useSelector(
    (state) => state.Order.data.customerList?.data
  );
  const categoryList = useSelector(
    (state) => state.Order.data.categoryList?.data
  );
  const itemList = useSelector((state) => state.Order.data.itemList?.data);
  const orderList = useSelector((state) => state.Order.data.orderList?.data);
  const orderDetailsList = useSelector(
    (state) => state.Order.data.orderDetailsList?.data
  );

  // console.log("orederDetailsList", orderDetailsList.RECEIVED_QTY);

  const [rates, setRates] = useState({});
  const [changes, setChanges] = useState({});

  const [quantityError, setQuantityError] = useState("");
  const [currentStock, setCurrentStock] = useState(0);
  const [itemStocks, setItemStocks] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [innerTableData, setInnerTableData] = useState([]);

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

  // const handleFieldChange = (value, field, index) => {
  //   dispatch(setReceivedQuantity({ price: value, index }));
  // };

  useEffect(() => {
    dispatch(getCustomer());
    dispatch(getItem());
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    if (selectedOrder !== null) {
      dispatch(getOrderDetails({ ORDER_ID: [selectedOrder.ID] }));
    } else {
      dispatch(getOrderDetails());
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (orderDetailsList) {
      const adaptedData = orderDetailsList.map((item) => ({
        id: item.ID,
        itemid: item.ITEM_ID,
        quantity: item.QTY,
        ReceivedQuantity: item.RECEIVED_QTY,
        rate: item.RATE,
      }));
      setorderreturnTableData(adaptedData);
      setLoading(false); // Set loading to false once data is available
    } else {
      setorderreturnTableData([]);
      setLoading(false); // Ensure loading is false if no data is available
    }
  }, [orderDetailsList]);

  const validationSchema = Yup.object().shape({
    SUB_TOTAL: Yup.string(),
    ORDER_AMOUNT: Yup.string(),
    CUSTOMER_ID: Yup.string(),
    ITEM_ID: Yup.string(),
    CREATED_BY: Yup.string(),
    FINE_AMOUNT: Yup.number(),
  });

  const initialValues = selectedOrder || {
    SUB_TOTAL: "",
    ORDER_AMOUNT: "",
    CUSTOMER_ID: "",
    ORDER_TYPE: "",
    CATEGORY_ID: "",
    ITEM_ID: "",
    CREATED_BY: "",
    orderDetails: [],
    ORDER_ID: [],
    FINE_AMOUNT: 0,
  };

  const handleEdit = (index, setFieldValue) => {
    const rowToEdit = orderreturnTableData[index];
    setEditingIndex(index);
    setFieldValue("ID", rowToEdit.id);
    setFieldValue("ITEM_ID", rowToEdit.itemid);
    setFieldValue("QTY", rowToEdit.quantity);
    setFieldValue(" RECEIVED_QTY", rowToEdit.ReceivedQuantity);
    setCurrentStock(getCurrentStock(rowToEdit.itemid));
  };
  useEffect(() => {
    if (orderDetailsList) {
      const initialRates = orderDetailsList.reduce((acc, item) => {
        acc[item.ID] =
          item.RECEIVED_QTY !== null ? item.RECEIVED_QTY : 0;
        return acc;
      }, {});
      setRates(initialRates);
      const initialChanges = orderDetailsList.reduce((acc, item) => {
        acc[item.ID] = 0;
        return acc;
      }, {});
      setChanges(initialChanges);
    }
  }, [orderDetailsList]);

  const handleRateChange = (e, record) => {
    const { value } = e.target;
    const receivedQty = Number(value) || 0;

    if (
      record.ReceivedQuantity !== null &&
      record.ReceivedQuantity !== undefined
    ) {
      const remainingQty = record.quantity;
      if (receivedQty > remainingQty) {
        e.target.value = remainingQty;
        notification.error({
          message: "Validation Error",
          description:
            "Received Quantity cannot exceed the remaining quantity.",
        });
      }
    }

    if (receivedQty > record.quantity) {
      e.target.value = record.quantity;
      notification.error({
        message: "Validation Error",
        description: "Received Quantity cannot be greater than Quantity.",
      });
    } else if (record.quantity === record.ReceivedQuantity) {
      notification.error({
        message: "Validation Error",
        description:
          "Received Quantity cannot be less than already received quantity.",
      });
    } else {
      setRates((prevRates) => ({
        ...prevRates,
        [record.id]: receivedQty,
      }));
    }
  };

  const handleDelete = (index) => {
    Modal.confirm({
      title: "Are you sure you want to delete this record?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        const updatedorderreturnTableData = orderreturnTableData.filter(
          (_, i) => i !== index
        );
        setorderreturnTableData(updatedorderreturnTableData);
      },
    });
  };
  const resetInnerTable = () => {
    setorderreturnTableData([]);
  };

  useEffect(() => {
    if (onResetInnerTableData) {
      onResetInnerTableData(() => resetInnerTable);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [onResetInnerTableData]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const userData = localStorage.getItem("UserData");
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

    const USERId = userDetails[0]?.USER_ID;
    if (!USERId) {
      console.error("EMP_ID is undefined");
      return;
    }
    const orderAmount = parseFloat(values.ORDER_AMOUNT) || 0;
    const fineAmount = parseFloat(values.FINE_AMOUNT) || 0;

    const totalDues = dayjs().diff(dayjs(selectedOrder?.ORDER_ENDTIME), "day");

    let multiplier = 0;
    if (totalDues >= 1 && totalDues <= 10) {
      multiplier = 10;
    } else if (totalDues >= 11 && totalDues <= 20) {
      multiplier = 20;
    } else if (totalDues >= 21 && totalDues <= 30) {
      multiplier = 30;
    }

    let calculatedSubtotal = orderAmount + fineAmount;

    orderDetailsList.forEach((item) => {
      calculatedSubtotal += item.RATE * item.QTY * multiplier;
    });

    try {
      const formattedData = {
        ...values,
        CREATED_BY: USERId,
        SUB_TOTAL: calculatedSubtotal,
        orderDetails: orderreturnTableData.map((item) => ({
          ID: item.id,
          ITEM_ID: item.itemid,
          QTY: item.quantity,
          RECEIVED_QTY: rates[item.id] !== undefined ? rates[item.id] : (item.ReceivedQuantity || 0),
          RATE: item.rate,
        })),
      };

      const action = await dispatch(getOrderReturn(formattedData));

      if (action.payload.code === 200) {
        dispatch(getOrder());
        dispatch(toggleNewDialog(false));
        api.success({
          message: "Form Submitted Successfully.",
        });
        resetForm();
        setorderreturnTableData([]);
        setDrawerVisible(false);
      } else {
        console.error("Error during form submission:", action.payload.error);
        api.error({
          message: "Form Submission Error",
          description: action.payload.error || "An unexpected error occurred.",
        });
      }
    } catch (error) {
      console.error("Unexpected error during form submission:", error);
      api.error({
        message: "Unexpected Error",
        description: "An unexpected error occurred during form submission.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const totalDues = dayjs().diff(dayjs(selectedOrder?.ORDER_ENDTIME), "day");

  const calculateDueCharges = () => {
    let multiplier = 0;
    if (totalDues >= 1 && totalDues <= 10) {
      multiplier = 10;
    } else if (totalDues >= 11 && totalDues <= 20) {
      multiplier = 20;
    } else if (totalDues >= 21 && totalDues <= 30) {
      multiplier = 30;
    }

    let dueCharges = 0;
    orderDetailsList?.forEach((item) => {
      dueCharges += item.RATE * item.QTY * multiplier;
    });
    return dueCharges;
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
          <FormikForm onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={5}>
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
                    disabled
                    className="!rounded !h-10 cursor-not-allowed"
                  >
                    {customerList?.map((customer) => (
                      <Option key={customer.ID} value={customer.ID}>
                        {customer.NAME}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item className="flex flex-col">
                  <span className="text-xs">Order End Time</span>
                  <Input
                    name="ORDER_ENDTIME"
                    placeholder="Order End Time"
                    value={selectedOrder?.ORDER_ENDTIME || ""}
                    onChange={handleChange}
                    disabled
                    onBlur={handleBlur}
                    className="!rounded !h-10 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>

              <Col span={5}>
                <Form.Item className="flex flex-col">
                  <span className="text-xs">Order Due</span>
                  <Input
                    name="ORDER_DUE"
                    placeholder="Order Due"
                    value={
                      dayjs().isAfter(selectedOrder?.ORDER_ENDTIME)
                        ? dayjs().diff(selectedOrder?.ORDER_ENDTIME, "day")
                        : 0
                    }
                    onChange={handleChange}
                    disabled
                    onBlur={handleBlur}
                    className="!rounded !h-10 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
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
                    onChange={handleChange}
                    disabled
                    onBlur={handleBlur}
                    className="!rounded !h-10 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item className="flex flex-col">
                  <span className="text-xs">Due Charges</span>
                  <Input
                    name="DUE_CHARGES"
                    placeholder="Due Charges"
                    value={calculateDueCharges()}
                    disabled
                    className="!rounded !h-10 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
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
                    value={
                      parseInt(values.ORDER_AMOUNT) +
                      calculateDueCharges() +
                      (parseInt(values.FINE_AMOUNT) || 0)
                    }
                    disabled
                    className="!rounded !h-10 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>

              <Col span={5}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.FINE_AMOUNT && errors.FINE_AMOUNT
                      ? errors.FINE_AMOUNT
                      : ""
                  }
                  validateStatus={
                    touched.FINE_AMOUNT && errors.FINE_AMOUNT
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Fine Amount</span>
                  <Input
                    name="FINE_AMOUNT"
                    placeholder="Fine Amount"
                    value={values.FINE_AMOUNT}
                    onChange={(e) => handleChange(e, setFieldValue)}
                    onBlur={handleBlur}
                    className="!rounded !h-10"
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="mt-4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Spin size="large" />
                </div>
              ) : (
                <Table
                  dataSource={orderreturnTableData}
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
                      title: "Quantity",
                      dataIndex: "quantity",
                      key: "quantity",
                    },
                    // {
                    //   title: "RECEIVED QUANTITY",
                    //   width: 300,
                    //   dataIndex: "RECEIVED_QTY",
                    //   render: (text, record, index) => (
                    //     <Input
                    //       value={record.RECEIVED_QTY || record.quantity}
                    //       onChange={(e) => {
                    //         const newQuantity = e.target.value;
                    //         setorderreturnTableData((prevData) =>
                    //           prevData.map((item, idx) =>
                    //             idx === index ? { ...item, RECEIVED_QTY: newQuantity } : item
                    //           )
                    //         );
                    //       }}
                    //       className="w-full rounded"
                    //     />
                    //   ),
                    // },
                    {
                      title: (
                        <span className="text-gray-500">Received Quantity</span>
                      ),
                      dataIndex: "RECEIVED_QTY",
                      width: 150,

                      render: (_, record) => (
                        <>
                          <Input
                            name="RECEIVED_QTY"
                            placeholder="Received Quantity"
                            value={rates[record.id]}
                            type="number"
                            min={record.ReceivedQuantity}
                            onChange={(e) => handleRateChange(e, record)}
                            className="!rounded w-40"
                            style={{ padding: "8px" }}
                            disabled={
                              record.ReceivedQuantity >= record.quantity
                            }
                          />
                        </>
                      ),
                    },
                  ]}
                  pagination={false}
                  className="mt-4"
                  bordered
                />
              )}
            </div>

            <div className="flex justify-end mt-4">
              <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                Save & close
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};
export default OrderReturn;
