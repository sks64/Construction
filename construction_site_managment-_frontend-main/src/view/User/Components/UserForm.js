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
import { getUser, postUser, putUser } from "../store/dataSlice";

const UserForm = () => {
  const [edit, setEdit] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  const { Option } = Select;
  const [localTransaction, setLocalTransaction] = useState(null);

  const selectedUser = useSelector((state) => state.user.state.selectedUser);

  let validationSchema;

  if (selectedUser) {
    validationSchema = Yup.object({
      NAME: Yup.string().required("Required"),
      MOBILE_NO: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Required"),
      EMAIL_ID: Yup.string()
        .email("Invalid email address")
        .required("Required"),
      ADDRESS: Yup.string().required("Required"),

      STATUS: Yup.string().required("Required"),
    });
  } else {
    validationSchema = Yup.object({
      NAME: Yup.string().required("Required"),
      MOBILE_NO: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Required"),
      EMAIL_ID: Yup.string()
        .email("Invalid email address")
        .required("Required"),
      ADDRESS: Yup.string().required("Required"),
      PASSWORD: Yup.string().required("Required"),
      STATUS: Yup.string().required("Required"),
    });
  }

  const handleCancel = () => {
    dispatch(toggleNewDialog(false));
  };

  useEffect(() => {
    if (selectedUser) {
      // const updatedTransaction = {
      //     ...selectedUser,
      //     PASSWORD: null,
      // };

      const updatedTransaction = {
        ID: selectedUser.ID,
        NAME: selectedUser.NAME,
        MOBILE_NO: selectedUser.MOBILE_NO,
        EMAIL_ID: selectedUser.EMAIL_ID,
        STATUS: selectedUser.STATUS,
        ADDRESS: selectedUser.ADDRESS,
      };
      setLocalTransaction(updatedTransaction);
      setEdit(true);
    } else {
      setLocalTransaction({
        NAME: null,
        MOBILE_NO: null,
        EMAIL_ID: null,
        ADDRESS: null,
        PASSWORD: null,
        STATUS: true,
      });
      setEdit(false);
    }
  }, [selectedUser]);

  const initialValues = localTransaction || {
    NAME: "",
    MOBILE_NO: "",
    EMAIL_ID: "",
    ADDRESS: "",
    PASSWORD: "",
    STATUS: true,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    //console.log(values);
    try {
      const action = edit
        ? await dispatch(putUser(values))
        : await dispatch(postUser(values));

      if (action.payload.data.code === 200) {
        dispatch(toggleNewDialog(false));
        dispatch(getUser());
        api.success({
          message: "Form Submitted Successfully.",
        });
      } else if (action.payload.data.code === 304) {
        console.info(
          "Mobile number or Email is already in use.",
          action.payload.error
        );
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
                    <span className="text-xs">User Name</span>
                    <Input
                      name="NAME"
                      placeholder="User Name"
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
                    <span className="text-xs">Mobile No</span>
                    <Input
                      name="MOBILE_NO"
                      type="number"
                      placeholder="Mobile Number"
                      // maxLength="10"
                      // min="10"
                      // max="11"
                      value={values.MOBILE_NO}
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
                      touched.EMAIL_ID && errors.EMAIL_ID ? errors.EMAIL_ID : ""
                    }
                    validateStatus={
                      touched.EMAIL_ID && errors.EMAIL_ID ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Email </span>
                    <Input
                      name="EMAIL_ID"
                      placeholder="Enter Email Id"
                      value={values.EMAIL_ID}
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
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.PASSWORD && errors.PASSWORD ? errors.PASSWORD : ""
                    }
                    validateStatus={
                      touched.PASSWORD && errors.PASSWORD ? "error" : undefined
                    }
                  >
                    <span className="text-xs">
                      {selectedUser ? "Change Password" : "Password"}
                    </span>
                    <Input
                      name="PASSWORD"
                      type="password"
                      placeholder={
                        selectedUser ? "Enter New Password" : "Password"
                      }
                      value={values.PASSWORD}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
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
                      className="mr-4 py-4 px-6 border border-blue-500"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      // disabled={isSubmitting}
                    >
                      {edit ? "Update" : "Submit"}
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

export default UserForm;
