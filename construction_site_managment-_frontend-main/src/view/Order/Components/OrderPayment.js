import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { Form, Input, Row, Col, Button, notification, Table } from "antd";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  GetPaymentDetails,
  AddPaymentDetails,
  getCustomer,
  getOrder,
} from "../store/dataSlice";
import {
  setSelectedOrder,
  toggleNewDialog,
  toggleSecondDialog,
  setSelectedThirdOrder,
} from "../store/stateSlice";
import Card from "antd/es/card/Card";
import { SiTicktick } from "react-icons/si";

const UserForm = ({ setDrawer2Visible }) => {
  const [edit, setEdit] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const dispatch = useDispatch();
  const [localTransaction, setLocalTransaction] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const customerList = useSelector(
    (state) => state.Order.data.customerList?.data
  );
  const selectedOrder = useSelector((state) => state.Order.state.selectedOrder);
  const selectedPayment = useSelector(
    (state) => state.Order.state.selectedPayment
  );
  const selectedSecondOrder = useSelector(
    (state) => state.Order.state.selectedSecondOrder
  );
  const data = useSelector((state) => state.Order.data.orderList?.data) || [];
  const orderList = useSelector((state) => state.Order.data.orderList?.data);
  const paymentList = useSelector(
    (state) => state.Order.data.paymentList?.data
  );

  // const { subtotal, paidAmount } = useSelector((state) => state.orderList ?.data);
  //console.log("orderList", orderList);
  // //console.log("selectedSecondOrder",selectedSecondOrder);
  //console.log("selectedPayment", selectedPayment);

  const onEditAmount = (record) => {
    dispatch(setSelectedThirdOrder(record));
  };

  const validationSchema = Yup.object({
    AMOUNT: Yup.number(),
    REMARK: Yup.string(),
  });
  useEffect(() => {
    dispatch(
      getOrder({
        /* your parameters here */
      })
    );
  }, [dispatch]);

  const handleCancel = () => {
    dispatch(toggleSecondDialog(false));
  };

  useEffect(() => {
    dispatch(getCustomer());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSecondOrder !== null) {
      dispatch(GetPaymentDetails({ ORDER_ID: [selectedSecondOrder.ID] }));
    } else {
      dispatch(GetPaymentDetails());
    }
  }, [selectedSecondOrder, dispatch]);

  useEffect(() => {
    if (selectedPayment) {
      const updatedTransaction = {
        AMOUNT: selectedPayment.AMOUNT,
        REMARK: selectedPayment.REMARK,
        CUSTOMER_ID: selectedPayment.CUSTOMER_ID,
        ORDER_ID: selectedPayment.ID,
      };
      setLocalTransaction(updatedTransaction);
      setEdit(true);
    } else {
      setLocalTransaction({
        AMOUNT: "",
        REMARK: "",
        ORDER_ID: selectedSecondOrder.ID,
        CUSTOMER_ID: selectedSecondOrder.CUSTOMER_ID,
      });
      setEdit(false);
    }
  }, [selectedPayment, selectedSecondOrder]);

  // useEffect(() => {
  //   const fetchPaymentDetails = async () => {
  //     try {
  //       const response = await dispatch(GetPaymentDetails()).unwrap();
  //       // Filter payment details based on selectedSecondOrder.ID
  //       const filteredDetails =
  //         response.data?.filter(
  //           (payment) => payment.ORDER_ID === selectedSecondOrder?.ID
  //         ) || [];
  //       setPaymentDetails(filteredDetails);
  //     } catch (error) {
  //       api.error({
  //         message: "Failed to fetch payment details.",
  //       });
  //     }
  //   };

  //   fetchPaymentDetails();
  // }, [dispatch, selectedSecondOrder]);

  const initialValues = {
    AMOUNT: "",
    REMARK: "",
    CUSTOMER_ID: selectedSecondOrder?.CUSTOMER_ID || "",
    REMAINING_AMOUNT: selectedSecondOrder 
      ? (selectedSecondOrder.SUB_TOTAL - selectedSecondOrder.PAID_AMOUNT) 
      : 0,
    ORDER_ID: selectedSecondOrder?.ID || "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const remaining = selectedSecondOrder?.SUB_TOTAL - selectedSecondOrder?.PAID_AMOUNT;
    if (parseFloat(values.AMOUNT) > remaining) {
      api.error({
        message: "Invalid Amount",
        description: `Amount cannot exceed the remaining balance of ${remaining}`,
      });
      setSubmitting(false);
      return;
    }

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

    try {
      const formattedData = {
        ...values,
        PAYMENT_COLLECTED_BY: USERId,
        ORDER_ID: selectedSecondOrder.ID,
        CUSTOMER_ID: selectedSecondOrder.CUSTOMER_ID,
      };

      const action = await dispatch(AddPaymentDetails(formattedData));

      if (action.payload && action.payload.code === 200) {
        await dispatch(GetPaymentDetails({ ORDER_ID: [selectedSecondOrder.ID] }));
        dispatch(getOrder());
        setDrawer2Visible(false);
        api.success({
          message: "Payment successful.",
        });
        resetForm();
      } else if (action.payload && action.payload.code === 304) {
        api.error({
          message: "Order Not Found",
          description: "The order you are trying to access does not exist.",
        });
      } else if (action.payload && action.payload.code === 305) {
        api.error({
          message: "Invalid Amount",
          description: action.payload.message || "The amount provided is not acceptable.",
        });
      } else {
        api.error({
          message: "Payment Error",
          description: action.payload?.message || action.payload?.error || "An unexpected error occurred.",
        });
      }
    } catch (error) {
      api.error({
        message: "Unexpected Error",
        description: "An unexpected error occurred during payment processing.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  //console.log("selectedSecondOrder.SUB_TOTAL", selectedSecondOrder.SUB_TOTAL);

  return (
    <>
      {contextHolder}
      <div className="mt-4">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Form
              onFinish={handleSubmit}
              onFinishFailed={(errorInfo) => {
                console.error("Failed:", errorInfo);
              }}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    help={touched.AMOUNT && errors.AMOUNT ? errors.AMOUNT : ""}
                    validateStatus={
                      touched.AMOUNT && errors.AMOUNT ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Amount</span>
                    <Input
                      name="AMOUNT"
                      placeholder="Amount"
                      value={values.AMOUNT}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    help={
                      touched.REMAINING_AMOUNT && errors.REMAINING_AMOUNT
                        ? errors.REMAINING_AMOUNT
                        : ""
                    }
                    validateStatus={
                      touched.REMAINING_AMOUNT && errors.REMAINING_AMOUNT
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">REMAINING_AMOUNT</span>
                    <Input
                      name="REMAINING_AMOUNT"
                      placeholder="REMAINING_AMOUNT"
                      value={values.REMAINING_AMOUNT}
                      disabled
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    help={touched.REMARK && errors.REMARK ? errors.REMARK : ""}
                    validateStatus={
                      touched.REMARK && errors.REMARK ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Remark</span>
                    <Input
                      name="REMARK"
                      placeholder="Remark"
                      value={values.REMARK}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item className="flex justify-end">
                    <Button
                      onClick={handleCancel}
                      className="mr-4 py-4 px-6 border border-blue-500"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={isSubmitting}
                    >
                      Make Payment
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
        <hr className="mt-6" />
        <div className="mt-16 flex flex-wrap justify-evenly ">
          {paymentList?.map((payment, index) => (
            <Card
              key={payment.id}
              title={
                <div className="flex justify-between">
                  <span>{`Payment ${index + 1}`}</span>
                  <SiTicktick className="text-green-500" />
                </div>
              }
              bordered={false}
              style={{
                width: 300,
                marginBottom: 16,
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                padding: 8,
              }}
              bodyStyle={{
                padding: "18px", // add padding to the card body
              }}
              headStyle={{
                padding: "18px", // add padding to the card head
              }}
            >
              <p className="flex">
                <p className="font-semibold mr-1">Payment Date:</p>
                {payment.PAYMENT_DATETIME}
              </p>
              <p className="flex">
                <p className="font-semibold mr-1">Amount:</p> {payment.AMOUNT}
              </p>
              <p className="flex">
                <p className="font-semibold mr-1">Remark:</p> {payment.REMARK}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserForm;
