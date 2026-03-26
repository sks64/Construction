import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { Form, notification, Table } from "antd";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  GetPaymentDetails,
  AddPaymentDetails,
  getCustomer,
} from "../store/dataSlice";
import { toggleNewDialog } from "../store/stateSlice";

const OrderPayment = ({ isDrawerOpen }) => {
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  const [paymentDetails, setPaymentDetails] = useState([]);

  console.log("payment detials", paymentDetails);

  const selectedOrder = useSelector(
    (state) => state.customer.state.selectedOrder
  );
  const data = useSelector(
    (state) => state?.customer?.data?.customerList?.data
  );

  // Find the selected customer details based on selectedOrder ID
  const selectedCustomer = data?.find(
    (customer) => customer.ID === selectedOrder?.ID
  );

  useEffect(() => {
    dispatch(
      getCustomer({
        /* your parameters here */
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (isDrawerOpen && selectedOrder) {
      const fetchPaymentDetails = async () => {
        try {
          const response = await dispatch(
            GetPaymentDetails({ CUSTOMER_ID: [selectedOrder.ID] })
          ).unwrap();

          const filteredDetails =
            response.data?.filter(
              (payment) => payment.CUSTOMER_ID === selectedOrder.ID
            ) || [];
          setPaymentDetails(filteredDetails);
        } catch (error) {
          api.error({
            message: "Failed to fetch payment details.",
          });
        }
      };

      fetchPaymentDetails();
    }
  }, [isDrawerOpen, selectedOrder, dispatch]);

  const validationSchema = Yup.object({
    AMOUNT: Yup.number().required("Amount is required"),
    REMARK: Yup.string().required("Remark is required"),
  });

  const initialValues = {
    AMOUNT: "",
    REMARK: "",
    REMAINING_AMOUNT: selectedOrder?.SUB_TOTAL - selectedOrder?.PAID_AMOUNT,
    CUSTOMER_ID: selectedOrder?.ID || "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const userData = localStorage.getItem("UserData");
    let userDetails = userData && JSON.parse(userData);
    const USERId = userDetails?.[0]?.USER_ID;

    if (!USERId) {
      console.error("EMP_ID is undefined");
      return;
    }

    try {
      const formattedData = {
        ...values,
        PAYMENT_COLLECTED_BY: USERId,
        CUSTOMER_ID: selectedOrder.ID,
      };

      const action = await dispatch(AddPaymentDetails(formattedData));

      if (action.payload.code === 200) {
        const newPayment = {
          ...formattedData,
          id: action.payload.id,
        };

        setPaymentDetails((prevDetails) => [...prevDetails, newPayment]);

        dispatch(toggleNewDialog(false));
        api.success({
          message: "Form Submitted Successfully.",
        });
        resetForm();
      } else {
        api.error({
          message: "Form Submission Error",
          description: action.payload.error || "An unexpected error occurred.",
        });
      }
    } catch (error) {
      api.error({
        message: "Unexpected Error",
        description: "An unexpected error occurred during form submission.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Payment Date",
      dataIndex: "PAYMENT_DATETIME",
      key: "PAYMENT_DATETIME",
    },
    {
      title: "Amount",
      dataIndex: "AMOUNT",
      key: "AMOUNT",
    },
    {
      title: "Remark",
      dataIndex: "REMARK",
      key: "REMARK",
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="mt-4">
        {selectedCustomer ? (
          <div className="mb-4">
            <p>
              <strong>Name:</strong> {selectedCustomer.NAME}
            </p>
            <p>
              <strong>Address:</strong> {selectedCustomer.ADDRESS}
            </p>
            <p>
              <strong>Contact No:</strong> {selectedCustomer.MOBILE_NO}
            </p>
          </div>
        ) : (
          <p>No customer details found.</p>
        )}
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <Form onFinish={handleSubmit}>
              {/* Form fields can be added here if necessary */}
            </Form>
          )}
        </Formik>
        <div className="mt-4">
          <Table
            columns={columns}
            dataSource={paymentDetails}
            pagination={false}
            bordered
            size="small"
            rowKey="id" // Ensure each row has a unique key
          />
        </div>
      </div>
    </>
  );
};

export default OrderPayment;
