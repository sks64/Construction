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
// import { getAccount, getGroup, postAccount, putAccount } from "../store/dataSlice";

const AccountForm = () => {
  const [edit, setEdit] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  const { Option } = Select;
  useEffect(() => {
    dispatch(getGroup());
  }, []);
  const groupList = useSelector((state) => state.account.data.groupList?.data);
  const accountList = useSelector(
    (state) => state.account.data.accountList?.data
  );
  const selectedAccount = useSelector(
    (state) => state.account.state.selectedAccount
  );

  const validationSchema = Yup.object({
    NAME: Yup.string().required("Required"),
    NAME_MR: Yup.string().required("Required"),
    GROUP_ID: Yup.string().required("Required"),
    PARENT_ACCOUNT_ID: Yup.string().required("Required"),
    OPENING_BALANCE: Yup.string().required("Required"),
    STATUS: Yup.string().required("Required"),
  });

  const handleCancel = () => {
    dispatch(toggleNewDialog(false));
  };

  useEffect(() => {
    if (selectedAccount) {
      setEdit(true);
    } else {
      setEdit(false);
    }
  }, [selectedAccount]);

  const initialValues = selectedAccount || {
    NAME: "",
    NAME_MR: "",
    GROUP_ID: "",
    PARENT_ACCOUNT_ID: "",
    OPENING_BALANCE: "",
    STATUS: true,
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    //console.log(values);
    try {
      const action = edit
        ? await dispatch(putAccount(values))
        : await dispatch(postAccount(values));

      if (action.payload.status < 300) {
        dispatch(toggleNewDialog(false));
        dispatch(getAccount());
        //console.log("Form submitted successfully!");
        api.success({
          message: "Form Submitted Successfully.",
        });
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
                <Col span={24}>
                  <Form.Item
                    className="flex flex-col"
                    help={touched.NAME && errors.NAME ? errors.NAME : ""}
                    validateStatus={
                      touched.NAME && errors.NAME ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Name</span>
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
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.NAME_MR && errors.NAME_MR ? errors.NAME_MR : ""
                    }
                    validateStatus={
                      touched.NAME_MR && errors.NAME_MR ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Name Mr</span>
                    <Input
                      name="NAME_MR"
                      placeholder="Name Mr"
                      value={values.NAME_MR}
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
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.PARENT_ACCOUNT_ID && errors.PARENT_ACCOUNT_ID
                        ? errors.PARENT_ACCOUNT_ID
                        : ""
                    }
                    validateStatus={
                      touched.PARENT_ACCOUNT_ID && errors.PARENT_ACCOUNT_ID
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Parent Account</span>
                    <Select
                      showSearch
                      placeholder="Select Parent name"
                      onChange={(value) =>
                        handleChange({
                          target: { name: "PARENT_ACCOUNT_ID", value },
                        })
                      }
                      value={values.PARENT_ACCOUNT_ID}
                      // filterOption={filterOption}
                      className="h-[40px] rounded"
                    >
                      {accountList?.map((type) => (
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
                <Col span={24}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.GROUP_ID && errors.GROUP_ID ? errors.GROUP_ID : ""
                    }
                    validateStatus={
                      touched.GROUP_ID && errors.GROUP_ID ? "error" : undefined
                    }
                  >
                    <span className="text-xs">Group Name</span>
                    <Select
                      showSearch
                      placeholder="Select Group name"
                      onChange={(value) =>
                        handleChange({ target: { name: "GROUP_ID", value } })
                      }
                      value={values.GROUP_ID}
                      // filterOption={filterOption}
                      className="h-[40px] rounded"
                    >
                      {groupList?.map((type) => (
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
                <Col span={24}>
                  <Form.Item
                    className="flex flex-col"
                    help={
                      touched.OPENING_BALANCE && errors.OPENING_BALANCE
                        ? errors.OPENING_BALANCE
                        : ""
                    }
                    validateStatus={
                      touched.OPENING_BALANCE && errors.OPENING_BALANCE
                        ? "error"
                        : undefined
                    }
                  >
                    <span className="text-xs">Opening Balance</span>
                    <Input
                      name="OPENING_BALANCE"
                      placeholder="Opening Balance"
                      value={values.OPENING_BALANCE}
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

export default AccountForm;
