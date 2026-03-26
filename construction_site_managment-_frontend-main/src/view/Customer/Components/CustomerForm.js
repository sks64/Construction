import React, { useEffect, useState } from "react";
import { Formik, Field } from "formik";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  notification,
  Switch,
} from "antd";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toggleNewDialog } from "../store/stateSlice";
import { DatePicker, Space } from "antd";
import moment from "moment";
import { getCustomer, postCustomer, putCustomer } from "../store/dataSlice";

const CustomerForm = () => {
  const [edit, setEdit] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  const { Option } = Select;
  const [localTransaction, setLocalTransaction] = useState(null);

  const selectedCustomer = useSelector(
    (state) => state.customer.state.selectedCustomer
  );

  let validationSchema;

  if (selectedCustomer) {
    validationSchema = Yup.object({
      NAME: Yup.string().required("Required"),
      MOBILE_NO: Yup.string().required("Required"),
      ADDRESS: Yup.string().required("Required"),
      // ADHAR_CARD: Yup.string(),
      // PAN_CARD: Yup.string(),
      STATUS: Yup.string().required("Required"),
    });
  } else {
    validationSchema = Yup.object({
      NAME: Yup.string().required("Required"),
      MOBILE_NO: Yup.string().required("Required"),
      ADDRESS: Yup.string().required("Required"),
      // ADHAR_CARD: Yup.string().required("Required"),
      // PAN_CARD: Yup.string(),
      // ADHAR_CARD: Yup.string(),
      STATUS: Yup.string().required("Required"),
    });
  }

  const handleCancel = () => {
    dispatch(toggleNewDialog(false));
  };

  useEffect(() => {
    if (selectedCustomer) {
      // const updatedTransaction = {
      //     ...selectedCustomer,
      //     PASSWORD: null,
      // };

      const updatedTransaction = {
        ID: selectedCustomer.ID,
        NAME: selectedCustomer.NAME,
        MOBILE_NO: selectedCustomer.MOBILE_NO,
        PAN_CARD: selectedCustomer.PAN_CARD,
        STATUS: selectedCustomer.STATUS,
        ADDRESS: selectedCustomer.ADDRESS,
        ADHAR_CARD: selectedCustomer.ADHAR_CARD,
        REFERENCE_BY: selectedCustomer.REFERENCE_BY,
      };
      setLocalTransaction(updatedTransaction);
      setEdit(true);
    } else {
      setLocalTransaction({
        NAME: "",
        MOBILE_NO: "",
        ADDRESS: "",
        ADHAR_CARD: "",
        PAN_CARD: "",
        REFERENCE_BY: "",
        STATUS: true,
      });
      setEdit(false);
    }
  }, [selectedCustomer]);

  const initialValues = localTransaction || {
    NAME: "",
    MOBILE_NO: "",
    ADDRESS: "",
    ADHAR_CARD: "",
    REFERENCE_BY: "",
    PAN_CARD: "",
    STATUS: true,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    // //console.log(values);
    try {
      const action = edit
        ? await dispatch(putCustomer(values))
        : await dispatch(postCustomer(values));

      if (action.payload.code === 200) {
        dispatch(toggleNewDialog(false));
        dispatch(getCustomer());
        api.success({
          message: "Customer Details Saved Successfully.",
        });
      } else if (action.payload.code === 304) {
        api.error({
          message: "Already Exists",
          description: "Mobile number or Email is already in use.",
        });
      } else {
        api.error({
          message: "Error",
          description: action.payload.message || "Failed to save customer details.",
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mt-4">
        {/* <h2 className="mb-2">Add Distributor</h2> */}
        {contextHolder}
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
            setFieldValue,
          }) => (
            <Form
              className=""
              onFinish={handleSubmit}
              onFinishFailed={(errorInfo) => {
                console.error("Failed:", errorInfo);
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    className="flex flex-col"
                    help={touched.NAME && errors.NAME ? errors.NAME : ""}
                    validateStatus={
                      touched.NAME && errors.NAME ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Customer Name</span>
                    <Input
                      name="NAME"
                      placeholder="Name"
                      value={values.NAME}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.ADDRESS && errors.ADDRESS ? errors.ADDRESS : ""
                    }
                    validateStatus={
                      touched.ADDRESS && errors.ADDRESS ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Address</span>
                    <Input
                      name="ADDRESS"
                      placeholder="Address"
                      value={values.ADDRESS}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>


                </Col>{" "}
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.MOBILE_NO && errors.MOBILE_NO
                        ? errors.MOBILE_NO
                        : ""
                    }
                    validateStatus={
                      touched.MOBILE_NO && errors.MOBILE_NO
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Phone</span>
                    <Input
                      name="MOBILE_NO"
                      placeholder="Mobile No"
                      value={values.MOBILE_NO}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>









                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.PAN_CARD && errors.PAN_CARD ? errors.PAN_CARD : ""
                    }
                    validateStatus={
                      touched.PAN_CARD && errors.PAN_CARD ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Pan Card</span>
                    <Input
                      name="PAN_CARD"
                      placeholder="Pan Card"
                      value={values.PAN_CARD}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.ADHAR_CARD && errors.ADHAR_CARD
                        ? errors.ADHAR_CARD
                        : ""
                    }
                    validateStatus={
                      touched.ADHAR_CARD && errors.ADHAR_CARD
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Adhar Card</span>
                    <Input
                      name="ADHAR_CARD"
                      placeholder="Adhar Card"
                      value={values.ADHAR_CARD}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>










                <Col span={12}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.REFERENCE_BY && errors.REFERENCE_BY
                        ? errors.REFERENCE_BY
                        : ""
                    }
                    validateStatus={
                      touched.REFERENCE_BY && errors.REFERENCE_BY
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Reference By</span>
                    <Input
                      name="REFERENCE_BY"
                      placeholder="Reference By"
                      value={values.REFERENCE_BY}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>





















              <Row gutter={16}>

                <Col span={12}>
                  <Form.Item
                    className="flex flex-col "
                    help={touched.STATUS && errors.STATUS ? errors.STATUS : ""}
                    validateStatus={
                      touched.STATUS && errors.STATUS ? "error" : undefined
                    }
                  >
                    <span className="text-xs ">Status</span>

                    {/* <Switch
                                            checked={values.STATUS}
                                            onChange={(checked) => setFieldValue("STATUS", checked)}
                                            defaultChecked
                                            style={{ padding: "8px" }}

                                        /> */}
                    <div style={{ marginTop: 8 }}>
                      <Switch
                        checked={values.STATUS}
                        onChange={(checked) => setFieldValue("STATUS", checked)}
                        defaultChecked
                        style={{ width: 50 }}
                      />
                    </div>

                    {/* setFieldValue is a function provided by Formik, a popular library for managing
                                         forms in React. It allows you to programmatically set the value of a field in the
                                          form state. This is particularly useful when you need to update the value of a field 
                                          based on some external input or event, rather than user input directly within a form field. */}
                  </Form.Item>
                </Col>

              </Row>


              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item className="flex justify-end">
                    <Button
                      onClick={handleCancel}
                      type="primary"
                      className="mr-4"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={isSubmitting}
                    >
                      {edit ? "Update" : "Save"}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
export default CustomerForm;
