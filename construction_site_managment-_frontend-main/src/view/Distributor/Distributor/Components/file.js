import React, { useState } from "react";
import { Formik, Field, Form as FormikForm } from "formik";
import * as Yup from "yup";
import {
  Button,
  Row,
  Col,
  Input,
  Form,
  Select,
  Radio,
  Tooltip,
  Table,
  Modal,
} from "antd";

import { useDispatch, useSelector } from "react-redux";
import { toggleNewDialog } from "../store/stateSlice";
import {
  getDistributor,
  postDistributor,
  putDistributor,
} from "../store/dataSlice";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const { Option } = Select;

const DistributorForm = () => {
  const [tableData, setTableData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const validationSchema = Yup.object().shape({
    DISTRIBUTOR_FIRM_NAME: Yup.string().required("Required"),
    OWNER_NAME: Yup.string().required("Required"),
    DISTRIBUTOR_FIRM_DETAILS: Yup.string().required("Required"),
    GST_NO: Yup.string().required("Required"),
    FOOD_LICENCE_NUMBER: Yup.string().required("Required"),
    SHOP_ACT_LICENCE_NUMBER: Yup.string().required("Required"),
    GODOWN: Yup.string().required("Required"),
    GODOWN_AREA: Yup.string().required("Required"),
    GODOWN_ADDRESS: Yup.string().required("Required"),
    SALESMAN: Yup.string().required("Required"),
    DELIVERY_BOY: Yup.string().required("Required"),
    DRIVER: Yup.string().required("Required"),
    CURRENT_VEHICLES: Yup.string().required("Required"),
    CURRENT_WORKING_AREA: Yup.string().required("Required"),
    CURRENT_TOTAL_ROUTES: Yup.string().required("Required"),
    CURRENT_TOTAL_SHOPS: Yup.string().required("Required"),
    MOBILE_NO: Yup.string().required("Required"),
    AGENCY_NAME: Yup.string().required("Required"),
    WORKING_PERIOD: Yup.string().required("Required"),
  });

  const initialValues = {
    DISTRIBUTOR_FIRM_NAME: "",
    OWNER_NAME: "",
    DISTRIBUTOR_FIRM_DETAILS: "",
    GST_NO: "",
    FOOD_LICENCE_NUMBER: "",
    SHOP_ACT_LICENCE_NUMBER: "",
    GODOWN: "",
    GODOWN_AREA: "",
    GODOWN_ADDRESS: "",
    SALESMAN: "",
    DELIVERY_BOY: "",
    DRIVER: "",
    CURRENT_VEHICLES: "",
    CURRENT_WORKING_AREA: "",
    CURRENT_TOTAL_ROUTES: "",
    CURRENT_TOTAL_SHOPS: "",
    MOBILE_NO: "",
    AGENCY_NAME: "",
    WORKING_PERIOD: "",
  };
  const handleEdit = (index, setFieldValue) => {
    const rowToEdit = tableData[index];
    setEditingIndex(index);
    setFieldValue("AGENCY_NAME", rowToEdit.agencyName);
    setFieldValue("WORKING_PERIOD", rowToEdit.workingPeriod);
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
      onCancel() {},
    });
  };
  const handleSubmit = (values, { setSubmitting }) => {
    // //console.log("Form data", values);
    setSubmitting(false);
  };

  const handleAddOrUpdate = (values, { resetForm }) => {
    const newRow = {
      agencyName: values.AGENCY_NAME,
      workingPeriod: values.WORKING_PERIOD,
    };
    if (editingIndex !== null) {
      const updatedTableData = tableData.map((row, index) =>
        index === editingIndex ? newRow : row
      );
      setTableData(updatedTableData);
      setEditingIndex(null);
    } else {
      setTableData((prevData) => [...prevData, newRow]);
    }

    resetForm();
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleBlur,
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
                    touched.DISTRIBUTOR_FIRM_NAME &&
                    errors.DISTRIBUTOR_FIRM_NAME
                      ? errors.DISTRIBUTOR_FIRM_NAME
                      : ""
                  }
                  validateStatus={
                    touched.DISTRIBUTOR_FIRM_NAME &&
                    errors.DISTRIBUTOR_FIRM_NAME
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Distributor Firm Name</span>
                  <Input
                    name="DISTRIBUTOR_FIRM_NAME"
                    placeholder="Distributor Firm Name"
                    value={values.DISTRIBUTOR_FIRM_NAME}
                    onChange={handleChange}
                    className="!rounded"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.OWNER_NAME && errors.OWNER_NAME
                      ? errors.OWNER_NAME
                      : ""
                  }
                  validateStatus={
                    touched.OWNER_NAME && errors.OWNER_NAME
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Owner Name</span>
                  <Input
                    name="OWNER_NAME"
                    placeholder="Owner Name"
                    value={values.OWNER_NAME}
                    onChange={handleChange}
                    className="!rounded"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={touched.GST_NO && errors.GST_NO ? errors.GST_NO : ""}
                  validateStatus={
                    touched.GST_NO && errors.GST_NO ? "error" : undefined
                  }
                >
                  <span className="text-xs">GST No</span>
                  <Input
                    name="GST_NO"
                    placeholder="GST No"
                    value={values.GST_NO}
                    onChange={handleChange}
                    className="!rounded"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.FOOD_LICENCE_NUMBER && errors.FOOD_LICENCE_NUMBER
                      ? errors.FOOD_LICENCE_NUMBER
                      : ""
                  }
                  validateStatus={
                    touched.FOOD_LICENCE_NUMBER && errors.FOOD_LICENCE_NUMBER
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Food Licence Number</span>
                  <Input
                    name="FOOD_LICENCE_NUMBER"
                    placeholder="Food Licence Number"
                    value={values.FOOD_LICENCE_NUMBER}
                    onChange={handleChange}
                    className="!rounded"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.SHOP_ACT_LICENCE_NUMBER &&
                    errors.SHOP_ACT_LICENCE_NUMBER
                      ? errors.SHOP_ACT_LICENCE_NUMBER
                      : ""
                  }
                  validateStatus={
                    touched.SHOP_ACT_LICENCE_NUMBER &&
                    errors.SHOP_ACT_LICENCE_NUMBER
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Shop Act Licence Number</span>
                  <Input
                    name="SHOP_ACT_LICENCE_NUMBER"
                    placeholder="Shop Act Licence Number"
                    value={values.SHOP_ACT_LICENCE_NUMBER}
                    onChange={handleChange}
                    className="!rounded"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.GODOWN_AREA && errors.GODOWN_AREA
                      ? errors.GODOWN_AREA
                      : ""
                  }
                  validateStatus={
                    touched.GODOWN_AREA && errors.GODOWN_AREA
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Godown Area</span>
                  <Input
                    name="GODOWN_AREA"
                    placeholder="Godown Area"
                    value={values.GODOWN_AREA}
                    onChange={handleChange}
                    className="!rounded"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.GODOWN_ADDRESS && errors.GODOWN_ADDRESS
                      ? errors.GODOWN_ADDRESS
                      : ""
                  }
                  validateStatus={
                    touched.GODOWN_ADDRESS && errors.GODOWN_ADDRESS
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Godown Address</span>
                  <Input
                    name="GODOWN_ADDRESS"
                    placeholder="Godown Address"
                    value={values.GODOWN_ADDRESS}
                    onChange={handleChange}
                    className="!rounded"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.SALESMAN && errors.SALESMAN ? errors.SALESMAN : ""
                  }
                  validateStatus={
                    touched.SALESMAN && errors.SALESMAN ? "error" : undefined
                  }
                >
                  <span className="text-xs">Salesman</span>
                  <Input
                    name="SALESMAN"
                    placeholder="Salesman"
                    value={values.SALESMAN}
                    onChange={handleChange}
                    className="!rounded"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.DELIVERY_BOY && errors.DELIVERY_BOY
                      ? errors.DELIVERY_BOY
                      : ""
                  }
                  validateStatus={
                    touched.DELIVERY_BOY && errors.DELIVERY_BOY
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Delivery Boy</span>
                  <Input
                    name="DELIVERY_BOY"
                    placeholder="Delivery Boy"
                    value={values.DELIVERY_BOY}
                    onChange={handleChange}
                    className="!rounded"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={touched.DRIVER && errors.DRIVER ? errors.DRIVER : ""}
                  validateStatus={
                    touched.DRIVER && errors.DRIVER ? "error" : undefined
                  }
                >
                  <span className="text-xs">Driver</span>
                  <Input
                    name="DRIVER"
                    placeholder="Driver"
                    value={values.DRIVER}
                    onChange={handleChange}
                    className="!rounded"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.CURRENT_WORKING_AREA && errors.CURRENT_WORKING_AREA
                      ? errors.CURRENT_WORKING_AREA
                      : ""
                  }
                  validateStatus={
                    touched.CURRENT_WORKING_AREA && errors.CURRENT_WORKING_AREA
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Current Working Area</span>
                  <Input
                    name="CURRENT_WORKING_AREA"
                    placeholder="Current Working Area"
                    value={values.CURRENT_WORKING_AREA}
                    onChange={handleChange}
                    className="!rounded"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.CURRENT_TOTAL_ROUTES && errors.CURRENT_TOTAL_ROUTES
                      ? errors.CURRENT_TOTAL_ROUTES
                      : ""
                  }
                  validateStatus={
                    touched.CURRENT_TOTAL_ROUTES && errors.CURRENT_TOTAL_ROUTES
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Current Total Routes</span>
                  <Input
                    name="CURRENT_TOTAL_ROUTES"
                    placeholder="Current Total Routes"
                    value={values.CURRENT_TOTAL_ROUTES}
                    onChange={handleChange}
                    className="!rounded"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.CURRENT_TOTAL_SHOPS && errors.CURRENT_TOTAL_SHOPS
                      ? errors.CURRENT_TOTAL_SHOPS
                      : ""
                  }
                  validateStatus={
                    touched.CURRENT_TOTAL_SHOPS && errors.CURRENT_TOTAL_SHOPS
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Current Total Shops</span>
                  <Input
                    name="CURRENT_TOTAL_SHOPS"
                    placeholder="Current Total Shops"
                    value={values.CURRENT_TOTAL_SHOPS}
                    onChange={handleChange}
                    className="!rounded"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.MOBILE_NO && errors.MOBILE_NO
                      ? errors.MOBILE_NO
                      : ""
                  }
                  validateStatus={
                    touched.MOBILE_NO && errors.MOBILE_NO ? "error" : undefined
                  }
                >
                  <span className="text-xs">Mobile No</span>
                  <Input
                    name="MOBILE_NO"
                    placeholder="Mobile No"
                    value={values.MOBILE_NO}
                    onChange={handleChange}
                    className="!rounded"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  className="!flex !flex-col"
                  help={
                    touched.DISTRIBUTOR_FIRM_DETAILS &&
                    errors.DISTRIBUTOR_FIRM_DETAILS
                      ? errors.DISTRIBUTOR_FIRM_DETAILS
                      : ""
                  }
                  validateStatus={
                    touched.DISTRIBUTOR_FIRM_DETAILS &&
                    errors.DISTRIBUTOR_FIRM_DETAILS
                      ? "error"
                      : undefined
                  }
                >
                  <div className="flex flex-col mt-1.5">
                    <span className="text-xs mb-1.5">
                      Distributor Firm Details
                    </span>
                    <Radio.Group
                      name="DISTRIBUTOR_FIRM_DETAILS"
                      onChange={(e) =>
                        setFieldValue(
                          "DISTRIBUTOR_FIRM_DETAILS",
                          e.target.value
                        )
                      }
                      value={values.DISTRIBUTOR_FIRM_DETAILS}
                    >
                      <Radio value="Partnership">Partnership</Radio>
                      <Radio value="Limited">Limited</Radio>
                      <Radio value="Private Limited">Private Limited</Radio>
                    </Radio.Group>
                  </div>
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item
                  className="flex flex-col"
                  help={touched.GODOWN && errors.GODOWN ? errors.GODOWN : ""}
                  validateStatus={
                    touched.GODOWN && errors.GODOWN ? "error" : undefined
                  }
                >
                  <div className="flex flex-col mt-1.5">
                    <span className="text-xs mb-1.5">Godown</span>
                    <Radio.Group
                      name="GODOWN"
                      onChange={(e) => setFieldValue("GODOWN", e.target.value)}
                      value={values.GODOWN}
                    >
                      <Radio value="Own">Own</Radio>
                      <Radio value="Rent">Rent</Radio>
                    </Radio.Group>
                  </div>
                </Form.Item>
              </Col>

              <Col span={5}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.CURRENT_VEHICLES && errors.CURRENT_VEHICLES
                      ? errors.CURRENT_VEHICLES
                      : ""
                  }
                  validateStatus={
                    touched.CURRENT_VEHICLES && errors.CURRENT_VEHICLES
                      ? "error"
                      : undefined
                  }
                >
                  <div className="flex flex-col mt-1.5">
                    <span className="text-xs mb-1.5">Current Vehicles</span>
                    <Radio.Group
                      name="CURRENT_VEHICLES"
                      onChange={(e) =>
                        setFieldValue("CURRENT_VEHICLES", e.target.value)
                      }
                      value={values.CURRENT_VEHICLES}
                    >
                      <Radio value="Two Wheeler">Two Wheeler</Radio>
                      <Radio value="Four Wheeler">Four Wheeler</Radio>
                    </Radio.Group>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}></Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.AGENCY_NAME && errors.AGENCY_NAME
                      ? errors.AGENCY_NAME
                      : ""
                  }
                  validateStatus={
                    touched.AGENCY_NAME && errors.AGENCY_NAME
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Agency Name</span>
                  <Input
                    name="AGENCY_NAME"
                    placeholder="Agency Name"
                    value={values.AGENCY_NAME}
                    onChange={handleChange}
                    className="!rounded mt-2"
                    onBlur={handleBlur}
                    style={{ padding: "8px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  className="flex flex-col"
                  help={
                    touched.WORKING_PERIOD && errors.WORKING_PERIOD
                      ? errors.WORKING_PERIOD
                      : ""
                  }
                  validateStatus={
                    touched.WORKING_PERIOD && errors.WORKING_PERIOD
                      ? "error"
                      : undefined
                  }
                >
                  <span className="text-xs">Working Period</span>
                  <div className="flex">
                    <Input
                      name="WORKING_PERIOD"
                      placeholder="Working Period"
                      value={values.WORKING_PERIOD}
                      onChange={handleChange}
                      className="!rounded mt-2"
                      onBlur={handleBlur}
                      style={{ padding: "8px" }}
                    />
                    <Tooltip title="Click to save">
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<span className="text-lg">+</span>}
                        onClick={() => handleAddOrUpdate(values, { resetForm })}
                        className="ml-2 mt-2 !w-12 !h-10 "
                      />
                    </Tooltip>
                  </div>
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
                  title: "Agency Name",
                  dataIndex: "agencyName",
                  key: "agencyName",
                },
                {
                  title: "Working Period",
                  dataIndex: "workingPeriod",
                  key: "workingPeriod",
                },
              ]}
              pagination={false}
              className="mt-4"
              bordered
            />
            <div className="flex justify-end mt-4">
              <Button
                type="primary"
                htmlType="submit"
                disabled={isSubmitting}
                onClick
              >
                Save and Close
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};

export default DistributorForm;
