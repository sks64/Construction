import React, { useEffect, useState } from "react";
import { Formik, Field } from "formik";
import { Form, Input, Row, Col, Button, Select, notification } from "antd";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toggleNewDialog } from "../store/stateSlice";
import { Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import axios from "axios";
import UploadImage from "./UploadImage";

import {
  postEmployee,
  putEmployee,
  getEmployee,
  getEmployeeId,
  getOrganisation,
  getDepartmentId,
  getDesignationId,
  getRoleId,
  getBranchId,
  getStateId,
  getEmployeeType,
} from "../store/dataSlice";
import { DatePicker, Space, Radio } from "antd";
import moment from "moment";

const EmployeeForm = () => {
  const [edit, setEdit] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  const selectedEmployee = useSelector(
    (state) => state.employee.state.selectedEmployee
  );
  //console.log(selectedEmployee);
  const [ROLE_NAME] = [selectedEmployee?.ROLE_NAME.split(",")];
  //console.log(ROLE_NAME);
  const { Option } = Select;

  //Pratik
  // const [ROLE_NAME] = [selectedEmployee?.ROLE_NAME.split(",")];
  // //console.log(ROLE_NAME);

  useEffect(() => {
    dispatch(getEmployeeId());
    dispatch(getOrganisation());
    dispatch(getDepartmentId());
    dispatch(getDesignationId());
    dispatch(getRoleId());
    dispatch(getBranchId());
    dispatch(getStateId());
    dispatch(getEmployeeType());
  }, []);

  const employeeList = useSelector(
    (state) => state.employee.data.employeeIdList?.data
  );
  const organisationList = useSelector(
    (state) => state.employee.data.organisationList?.data
  );
  const departmentIdList = useSelector(
    (state) => state.employee.data.departmentIdList?.data
  );
  const designationIdList = useSelector(
    (state) => state.employee.data.designationIdList?.data
  );
  const roleIdList = useSelector(
    (state) => state.employee.data.roleIdList?.data
  );
  const branchIdList = useSelector(
    (state) => state.employee.data.branchIdList?.data
  );
  const stateIdList = useSelector(
    (state) => state.employee.data.stateIdList?.data
  );
  const employeeTypeList = useSelector(
    (state) => state.employee.data.employeeTypeList?.data
  );

  const validationSchema = Yup.object({
    FIRST_NAME: Yup.string().required("Required"),
    LAST_NAME: Yup.string().required("Required"),
    DESIGNATION_ID: Yup.string().required("Required"),
    EMAIL_ID: Yup.string().required("Required"),
    MOBILE_NO: Yup.string().required("Required").max(10, "Max length is 10"),
    REPORTING_HEAD_ID: Yup.string().required("Required"),
    // TEMPORARY_HEAD_ID: Yup.string().required("Required"),
    ORG_ID: Yup.string().required("Required"),
    DEPARTMENT_ID: Yup.string().required("Required"),
    // GENDER: Yup.string().required("Required"),
    DOB: Yup.string().required("Required"),
    // ADDRESS: Yup.string().required("Required"),
    // PINCODE: Yup.string().required("Required"),
    // roleData: Yup.string().required("Required"),
    // STATE_ID: Yup.string().required("Required"),
    BRANCH_ID: Yup.string().required("Required"),
    DOJ: Yup.string().required("Required"),
    EMPLOYEE_TYPE: Yup.string().required("Required"),
    // PROFILE_PHOTO: Yup.string().required("Required"),
  });

  const handleCancel = () => {
    dispatch(toggleNewDialog(false));
  };

  useEffect(() => {
    if (selectedEmployee) {
      setEdit(true);
    } else {
      setEdit(false);
    }
  }, [selectedEmployee]);

  const initialValues = selectedEmployee || {
    FIRST_NAME: "",
    MIDDLE_NAME: "",
    LAST_NAME: "",
    DESIGNATION_ID: "",
    EMAIL_ID: "",
    MOBILE_NO: "",
    REPORTING_HEAD_ID: "",
    TEMPORARY_HEAD_ID: "",
    STATUS: true,
    ORG_ID: "",
    DEPARTMENT_ID: "",
    GENDER: "",
    DOB: "",
    ADDRESS: "",
    CITY: "",
    PINCODE: "",
    roleData: [],
    DOJ: "",
    // STATE_ID: "",
    BRANCH_ID: "",
    PROFILE_PHOTO: "",
    AADHAR_NO: "",
    PAN_NO: "",
    EMPLOYEE_TYPE: "",
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const action = edit
        ? await dispatch(putEmployee(values))
        : await dispatch(postEmployee(values));

      if (action.payload.status === 200) {
        dispatch(toggleNewDialog(false));
        dispatch(getEmployee());
        ////console.log("Form submitted successfully!");
        if (action.payload.data.code === 200) {
          api.success({
            message: "Form Submitted Successfully.",
          });
        } else if (action.payload.data.code === 304) {
          api.error({
            message: "Mobile Number Already Exists.",
          });
        } else {
          console.error("Error occurred during form submission:");
          // Handle other errors or statuses as needed
        }
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
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.FIRST_NAME && errors.FIRST_NAME
                        ? errors.FIRST_NAME
                        : ""
                    }
                    validateStatus={
                      touched.FIRST_NAME && errors.FIRST_NAME
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">First Name</span>
                    <Input
                      name="FIRST_NAME"
                      placeholder="Enter First Name"
                      value={values.FIRST_NAME}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item className="flex flex-col">
                    <span className="text-xs">Middle Name</span>
                    <Input
                      name="MIDDLE_NAME"
                      placeholder="Enter Middle Name"
                      value={values.MIDDLE_NAME}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.LAST_NAME && errors.LAST_NAME
                        ? errors.LAST_NAME
                        : ""
                    }
                    validateStatus={
                      touched.LAST_NAME && errors.LAST_NAME
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Last Name</span>
                    <Input
                      name="LAST_NAME"
                      placeholder="Enter Last Name"
                      value={values.LAST_NAME}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={touched.GENDER && errors.GENDER ? errors.GENDER : ""}
                    validateStatus={
                      touched.GENDER && errors.GENDER ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Gender</span>
                    <Radio.Group
                      onChange={(e) =>
                        handleChange({
                          target: { name: "GENDER", value: e.target.value },
                        })
                      }
                      value={values.GENDER}
                    >
                      <Radio value={"M"}>Male</Radio>
                      <Radio value={"F"}>Female</Radio>
                      <Radio value={"O"}>Other</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={touched.DOB && errors.DOB ? errors.DOB : ""}
                    validateStatus={
                      touched.DOB && errors.DOB ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Date Of Birth</span>
                    <Field name="DOB">
                      {({ field, form }) => (
                        <DatePicker
                          {...field}
                          value={field.value ? moment(field.value) : null}
                          onChange={(date, dateString) =>
                            form.setFieldValue("DOB", dateString)
                          }
                          onBlur={form.handleBlur}
                          className="!rounded"
                          style={{ width: "100%", padding: "8px" }}
                          disabledDate={(current) => {
                            // Can not select days before today and today
                            return (
                              current &&
                              current > moment().subtract(18, "years")
                            );
                          }}
                        />
                      )}
                    </Field>
                  </Form.Item>
                </Col>

                <Col span={8}>
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
                    <span className="text-xs">Mobile No.</span>
                    <Input
                      name="MOBILE_NO"
                      placeholder="Enter Mobile No."
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
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.EMAIL_ID && errors.EMAIL_ID ? errors.EMAIL_ID : ""
                    }
                    validateStatus={
                      touched.EMAIL_ID && errors.EMAIL_ID ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Email Id</span>
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

                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.AADHAR_NO && errors.AADHAR_NO
                        ? errors.AADHAR_NO
                        : ""
                    }
                    validateStatus={
                      touched.AADHAR_NO && errors.AADHAR_NO
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Aadhar No.</span>
                    <Input
                      name="AADHAR_NO"
                      placeholder="Enter Aadhar No."
                      value={values.AADHAR_NO}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={touched.PAN_NO && errors.PAN_NO ? errors.PAN_NO : ""}
                    validateStatus={
                      touched.PAN_NO && errors.PAN_NO ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Pan No.</span>
                    <Input
                      name="PAN_NO"
                      placeholder="Enter Pan No."
                      value={values.PAN_NO}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
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
                      placeholder="Enter Address"
                      value={values.ADDRESS}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={touched.CITY && errors.CITY ? errors.CITY : ""}
                    validateStatus={
                      touched.CITY && errors.CITY ? "error" : undefined
                    }
                  >
                    <span className="text-xs">City</span>
                    <Input
                      name="CITY"
                      placeholder="Enter City"
                      value={values.CITY}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.PINCODE && errors.PINCODE ? errors.PINCODE : ""
                    }
                    validateStatus={
                      touched.PINCODE && errors.PINCODE ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Pincode</span>
                    <Input
                      name="PINCODE"
                      placeholder="Enter Pincode"
                      value={values.PINCODE}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="!rounded"
                      style={{ padding: "8px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}></Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    // help={
                    //   touched.PROFILE_PHOTO && errors.PROFILE_PHOTO
                    //     ? errors.PROFILE_PHOTO
                    //     : ""
                    // }
                    // validateStatus={
                    //   touched.PROFILE_PHOTO && errors.PROFILE_PHOTO
                    //     ? "error"
                    //     : undefined
                    // }
                  >
                    <span className="text-xs block">Profile Photo</span>
                    <Upload
                      name="PROFILE_PHOTO"
                      customRequest={({ file, onSuccess }) => {
                        UploadImage(
                          file,
                          "your-upload-endpoint",
                          "PROFILE_PHOTO"
                        ).then((newFilename) => {
                          if (newFilename) {
                            onSuccess("ok");
                            setFieldValue("PROFILE_PHOTO", newFilename); // Save the new filename in form values
                          }
                        });
                      }}
                      listType="picture"
                      className="!rounded"
                      style={{ padding: "8px" }}
                    >
                      <Button
                        style={{ width: "240px", marginTop: "10px" }}
                        icon={<UploadOutlined />}
                      >
                        Click to upload
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.DESIGNATION_ID && errors.DESIGNATION_ID
                        ? errors.DESIGNATION_ID
                        : ""
                    }
                    validateStatus={
                      touched.DESIGNATION_ID && errors.DESIGNATION_ID
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Designation</span>
                    <Select
                      showSearch
                      placeholder="Select Designation"
                      onChange={(value) =>
                        handleChange({
                          target: { name: "DESIGNATION_ID", value },
                        })
                      }
                      value={values.DESIGNATION_ID}
                      // filterOption={filterOption}
                      className="h-[40px] rounded"
                    >
                      {designationIdList?.map((type) => (
                        <Option
                          key={type.ID}
                          value={type.ID}
                          className="text-gray-400"
                        >
                          {type.DESIGNATION}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.JOINING_DATE && errors.JOINING_DATE
                        ? errors.JOINING_DATE
                        : ""
                    }
                    validateStatus={
                      touched.JOINING_DATE && errors.JOINING_DATE
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Date of Joining</span>
                    <Field name="DOJ">
                      {({ field, form }) => (
                        <DatePicker
                          {...field}
                          value={field.value ? moment(field.value) : null}
                          onChange={(date, dateString) =>
                            form.setFieldValue("DOJ", dateString)
                          }
                          onBlur={form.handleBlur}
                          className="!rounded"
                          style={{ width: "100%", padding: "8px" }}
                        />
                      )}
                    </Field>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.EMPLOYEE_TYPE && errors.EMPLOYEE_TYPE
                        ? errors.EMPLOYEE_TYPE
                        : ""
                    }
                    validateStatus={
                      touched.EMPLOYEE_TYPE && errors.EMPLOYEE_TYPE
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Employee Type</span>
                    <Select
                      showSearch
                      placeholder="Select Employee Type"
                      onChange={(value) =>
                        handleChange({
                          target: { name: "EMPLOYEE_TYPE", value },
                        })
                      }
                      value={values.EMPLOYEE_TYPE}
                      // filterOption={filterOption}
                      className="h-[40px] rounded"
                    >
                      {employeeTypeList?.map((type) => (
                        <Option
                          key={type.ID}
                          value={type.ID}
                          className="text-gray-400"
                        >
                          {type.EMPLOYEE_TYPE}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={touched.ORG_ID && errors.ORG_ID ? errors.ORG_ID : ""}
                    validateStatus={
                      touched.ORG_ID && errors.ORG_ID ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Organization Name</span>
                    <Select
                      showSearch
                      placeholder="Select Organization Name"
                      onChange={(value) =>
                        handleChange({ target: { name: "ORG_ID", value } })
                      }
                      value={values.ORG_ID}
                      // filterOption={filterOption}
                      className="h-[40px] rounded"
                    >
                      {organisationList?.map((type) => (
                        <Option
                          key={type.ID}
                          value={type.ID}
                          className="text-gray-400"
                        >
                          {type.ORGANISATION}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.BRANCH_ID && errors.BRANCH_ID
                        ? errors.BRANCH_ID
                        : ""
                    }
                    validateStatus={
                      touched.BRANCH_ID && errors.BRANCH_ID
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Branch</span>
                    <Select
                      showSearch
                      placeholder="Select branch"
                      onChange={(value) =>
                        handleChange({ target: { name: "BRANCH_ID", value } })
                      }
                      value={values.BRANCH_ID}
                      // filterOption={filterOption}
                      className="h-[40px] rounded"
                    >
                      {branchIdList?.map((type) => (
                        <Option
                          key={type.ID}
                          value={type.ID}
                          className="text-gray-400"
                        >
                          {type.NAME}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.DEPARTMENT_ID && errors.DEPARTMENT_ID
                        ? errors.DEPARTMENT_ID
                        : ""
                    }
                    validateStatus={
                      touched.DEPARTMENT_ID && errors.DEPARTMENT_ID
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Department Name</span>
                    <Select
                      showSearch
                      placeholder="Select Department Name"
                      onChange={(value) =>
                        handleChange({
                          target: { name: "DEPARTMENT_ID", value },
                        })
                      }
                      value={values.DEPARTMENT_ID}
                      // filterOption={filterOption}
                      className="h-[40px] rounded"
                    >
                      {departmentIdList?.map((type) => (
                        <Option
                          key={type.ID}
                          value={type.ID}
                          className="text-gray-400"
                        >
                          {type.DEPARTMENT}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.REPORTING_HEAD_ID && errors.REPORTING_HEAD_ID
                        ? errors.REPORTING_HEAD_ID
                        : ""
                    }
                    validateStatus={
                      touched.REPORTING_HEAD_ID && errors.REPORTING_HEAD_ID
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Reporting Head Person</span>
                    <Select
                      showSearch
                      placeholder="Select Reporting Head Person"
                      onChange={(value) =>
                        handleChange({
                          target: { name: "REPORTING_HEAD_ID", value },
                        })
                      }
                      value={values.REPORTING_HEAD_ID}
                      // filterOption={filterOption}
                      className="h-[40px] rounded"
                    >
                      {employeeList?.map((type) => (
                        <Option
                          key={type.ID}
                          value={type.ID}
                          className="text-gray-400"
                        >
                          {`${type.FIRST_NAME} ${type.MIDDLE_NAME} ${type.LAST_NAME}`}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.TEMPORARY_HEAD_ID && errors.TEMPORARY_HEAD_ID
                        ? errors.TEMPORARY_HEAD_ID
                        : ""
                    }
                    validateStatus={
                      touched.TEMPORARY_HEAD_ID && errors.TEMPORARY_HEAD_ID
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Temporary Head Person</span>
                    <Select
                      showSearch
                      placeholder="Select Temporary Head Person"
                      onChange={(value) =>
                        handleChange({
                          target: { name: "TEMPORARY_HEAD_ID", value },
                        })
                      }
                      value={values.TEMPORARY_HEAD_ID}
                      // filterOption={filterOption}
                      className="h-[40px] rounded"
                    >
                      {employeeList?.map((type) => (
                        <Option
                          key={type.ID}
                          value={type.ID}
                          className="text-gray-400"
                        >
                          {`${type.FIRST_NAME} ${type.MIDDLE_NAME} ${type.LAST_NAME}`}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    // help={
                    //   touched.roleData && errors.roleData ? errors.roleData : ""
                    // }
                    // validateStatus={
                    //   touched.roleData && errors.roleData ? "error" : undefined
                    // }
                  >
                    <span className="text-xs">Role Name</span>
                    <Select
                      mode="multiple"
                      defaultValue={ROLE_NAME}
                      placeholder="Select Role Name"
                      onChange={(value) =>
                        handleChange({ target: { name: "roleData", value } })
                      }
                      value={values.roleData}
                      // filterOption={filterOption}
                      className="rounded"
                    >
                      {roleIdList?.map((type) => (
                        <Option
                          key={type.ID}
                          value={type.ID}
                          className="text-gray-400"
                        >
                          {type.NAME}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    className="flex flex-col"
                    help={touched.STATUS && errors.STATUS ? errors.STATUS : ""}
                    validateStatus={
                      touched.STATUS && errors.STATUS ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Status</span>

                    <div style={{ marginTop: 8 }}>
                      <Switch
                        defaultChecked
                        checked={values.STATUS}
                        onChange={(checked) => setFieldValue("STATUS", checked)}
                        style={{ width: 50 }}
                      />
                    </div>
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

export default EmployeeForm;
