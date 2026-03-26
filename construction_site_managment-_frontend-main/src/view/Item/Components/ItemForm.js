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
import { getItem, postItem, putItem, getCategory } from "../store/dataSlice";

const ItemForm = ({ handleRefresh }) => {
  const [edit, setEdit] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  const { Option } = Select;
  const [localTransaction, setLocalTransaction] = useState(null);
  const dialog = useSelector((state) => state.item.state.newDialog);
  const selectedItem = useSelector((state) => state.item.state.selectedItem);

  //console.log("selected item", selectedItem);
  const categories = useSelector(
    (state) => state.item.data.categoryList?.data
  );

  console.log("categories", categories);

  let validationSchema;

  if (selectedItem) {
    validationSchema = Yup.object({
      NAME: Yup.string().required("Required"),
      CURRENT_STOCK: Yup.string().required("Required"),
      STATUS: Yup.string().required("Required"),
      CATEGORY_ID: Yup.string().required("Required"),
      SALE_RATE: Yup.string().required("Required"),
      RENT_RATE: Yup.string().required("Required"),
      GST_PERCENT: Yup.string().required("Required"),
    });
  } else {
    validationSchema = Yup.object({
      NAME: Yup.string().required("Required"),
      CURRENT_STOCK: Yup.string().required("Required"),
      STATUS: Yup.string().required("Required"),
      CATEGORY_ID: Yup.string().required("Required"),
      SALE_RATE: Yup.string().required("Required"),
      RENT_RATE: Yup.string().required("Required"),
      GST_PERCENT: Yup.string().required("Required"),
    });
  }
  const handleCancel = () => {
    dispatch(toggleNewDialog(false));
  };

  useEffect(() => {
    if (selectedItem) {
      // const updatedTransaction = {
      //     ...selectedItem,
      //     PASSWORD: null,
      // };

      const updatedTransaction = {
        ID: selectedItem.ID,
        NAME: selectedItem.NAME,
        CURRENT_STOCK: selectedItem.CURRENT_STOCK,
        STATUS: selectedItem.STATUS,
        CATEGORY_ID: selectedItem.CATEGORY_ID,
        SALE_RATE: selectedItem.SALE_RATE,
        RENT_RATE: selectedItem.RENT_RATE,
        GST_PERCENT: selectedItem.GST_PERCENT,
      };
      setLocalTransaction(updatedTransaction);
      setEdit(true);
    } else {
      setLocalTransaction({
        NAME: "",
        CURRENT_STOCK: "",
        STATUS: true,
        CATEGORY_ID: "",
        SALE_RATE: "",
        RENT_RATE: "",
        GST_PERCENT: "",
      });
      setEdit(false);
    }
  }, [selectedItem, dispatch]);

  useEffect(() => {
    if (dialog) {
      dispatch(getCategory());
    }
  }, [dispatch, dialog]);

  const initialValues = localTransaction || {
    NAME: "",
    CURRENT_STOCK: "",
    STATUS: true,
    CATEGORY_ID: "",
    SALE_RATE: "",
    RENT_RATE: "",
    GST_PERCENT: "",
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    //console.log(values);
    try {
      const action = edit
        ? await dispatch(putItem(values))
        : await dispatch(postItem(values));

      if (action.payload.code === 200) {
        dispatch(toggleNewDialog(false));
        dispatch(getItem());
        api.success({
          message: "Item Details Saved Successfully.",
        });
      } else if (action.payload.code === 304) {
        api.error({
          message: "Already Exists",
          description: "Item name is already in use.",
        });
      } else {
        api.error({
          message: "Error",
          description: action.payload.message || "Failed to save item details.",
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
                    <span className="text-xs">Item Name</span>
                    <Input
                      name="NAME"
                      placeholder="Item Name"
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
                      touched.CURRENT_STOCK && errors.CURRENT_STOCK
                        ? errors.CURRENT_STOCK
                        : ""
                    }
                    validateStatus={
                      touched.CURRENT_STOCK && errors.CURRENT_STOCK
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Current Stock</span>
                    <Input
                      name="CURRENT_STOCK"
                      type="number"
                      placeholder="CURRENT_STOCK Number"
                      // maxLength="10"
                      // min="10"
                      // max="11"
                      value={values.CURRENT_STOCK}
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
                    <span className="text-xs">Category</span>
                    <Select
                      value={values.CATEGORY_ID}
                      onChange={(value) =>
                        handleChange({ target: { name: "CATEGORY_ID", value } })
                      }
                      placeholder="Select Category"
                      className="!rounded h-10"
                    >
                      {categories?.map((option) => (
                        <Option key={option.ID} value={option.ID}>
                          {option.NAME}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.SALE_RATE && errors.SALE_RATE
                        ? errors.SALE_RATE
                        : ""
                    }
                    validateStatus={
                      touched.SALE_RATE && errors.SALE_RATE
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Sale Rate</span>
                    <Input
                      name="SALE_RATE"
                      type="number"
                      placeholder="Sale Rate"
                      value={values.SALE_RATE}
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
                      touched.RENT_RATE && errors.RENT_RATE
                        ? errors.RENT_RATE
                        : ""
                    }
                    validateStatus={
                      touched.RENT_RATE && errors.RENT_RATE
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Rent Rate</span>
                    <Input
                      name="RENT_RATE"
                      type="number"
                      placeholder="Rent Rate"
                      value={values.RENT_RATE}
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
                      touched.GST_PERCENT && errors.GST_PERCENT
                        ? errors.GST_PERCENT
                        : ""
                    }
                    validateStatus={
                      touched.GST_PERCENT && errors.GST_PERCENT
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">GST Percent</span>
                    <Input
                      name="GST_PERCENT"
                      type="number"
                      placeholder="GST Percent"
                      value={values.GST_PERCENT}
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

export default ItemForm;
