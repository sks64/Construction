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
import { getCategory, postCategory, putCategory } from "../store/dataSlice";

const CategoryForm = () => {
  const [edit, setEdit] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  const { Option } = Select;
  const [localTransaction, setLocalTransaction] = useState(null);

  const selectedCategory = useSelector(
    (state) => state.category.state.selectedCategory
  );

  let validationSchema;

  if (selectedCategory) {
    validationSchema = Yup.object({
      NAME: Yup.string().required("Required"),
      STATUS: Yup.string().required("Required"),
    });
  } else {
    validationSchema = Yup.object({
      NAME: Yup.string().required("Required"),
      STATUS: Yup.string().required("Required"),
    });
  }

  const handleCancel = () => {
    dispatch(toggleNewDialog(false));
  };

  useEffect(() => {
    if (selectedCategory) {
      // const updatedTransaction = {
      //     ...selectedCategory,
      //     PASSWORD: null,
      // };

      const updatedTransaction = {
        ID: selectedCategory.ID,
        NAME: selectedCategory.NAME,

        STATUS: selectedCategory.STATUS,
      };
      setLocalTransaction(updatedTransaction);
      setEdit(true);
    } else {
      setLocalTransaction({
        NAME: "",
        STATUS: true,
      });
      setEdit(false);
    }
  }, [selectedCategory]);

  const initialValues = localTransaction || {
    NAME: "",
    STATUS: true,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    // //console.log(values);
    try {
      const action = edit
        ? await dispatch(putCategory(values))
        : await dispatch(postCategory(values));

      if (action.payload.code === 200) {
        dispatch(toggleNewDialog(false));
        dispatch(getCategory());
        api.success({
          message: "Category Details Saved Successfully.",
        });
      } else if (action.payload.code === 304) {
        api.error({
          message: "Already Exists",
          description: "Category name is already in use.",
        });
      } else {
        api.error({
          message: "Error",
          description: action.payload.message || "Failed to save category details.",
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
                    <span className="text-xs">Category Name</span>
                    <Input
                      name="NAME"
                      placeholder="Category Name"
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

export default CategoryForm;
