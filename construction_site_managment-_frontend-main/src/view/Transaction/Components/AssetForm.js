import React, { useEffect, useState } from "react";
import { Formik, Form as FormikForm } from "formik";
import { Field } from "formik";
import { Form, Input, Select, Row, Col, Button, Switch, notification, DatePicker } from "antd";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toggleNewDialog } from "../store/stateSlice";
import { postAsset, putAsset, getAsset, getAssetCategory } from "../store/dataSlice";
import moment from "moment";
const { TextArea } = Input;
const { Option } = Select;

const AssetForm = ({ handleRefresh }) => {
    const [showSaveNext, setShowSaveNext] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [edit, setEdit] = useState(false);
    const dispatch = useDispatch();
    const selectedAsset = useSelector((state) => state.asset.state.selectedAsset);
    const categoryList = useSelector((state) => state?.asset?.data?.categoryList?.data);
    const assetgroupList = useSelector((state) => state?.accountgroup?.data?.accountgroupList?.data);


    const validationSchema = Yup.object({
        CATEGORY_ID: Yup.string().required("Required"),
        STATUS: Yup.boolean().required("Required"),
        NARRATION: Yup.string().required("Required"),
        AMOUNT: Yup.string().required("Required"),

    });

    useEffect(() => {
        if (selectedAsset) {
            setEdit(true);
        } else {
            setEdit(false);
        }
    }, [selectedAsset]);

    useEffect(() => {
        dispatch(getAssetCategory());
    }, []);

    const initialValues = selectedAsset || {
        STATUS: true,

        DATE: moment(),
        AMOUNT: "",
        NARRATION: "",
    };

    const handleCancel = () => {
        dispatch(toggleNewDialog(false));
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const action = edit
                ? await dispatch(putAsset(values))
                : await dispatch(postAsset(values));

            if (action.payload.code < 300) {
                dispatch(getAsset());
                dispatch(toggleNewDialog(false));
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
        <div className="mt-4">
            {contextHolder}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, touched, errors, handleChange, setFieldValue }) => (
                    <FormikForm>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    className="flex flex-col"
                                    help={
                                        touched.DATE && errors.DATE
                                            ? errors.DATE
                                            : ""
                                    }
                                    validateStatus={
                                        touched.DATE && errors.DATE
                                            ? "error"
                                            : undefined
                                    }
                                >
                                    <span className="text-xs">Date </span>
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
                            <Col span={12}>
                                <Form.Item
                                    className="flex flex-col"
                                    help={
                                        touched.AMOUNT && errors.AMOUNT
                                            ? errors.AMOUNT
                                            : ""
                                    }
                                    validateStatus={
                                        touched.AMOUNT && errors.AMOUNT
                                            ? "error"
                                            : undefined
                                    }
                                >
                                    <span className="text-xs">Amount</span>
                                    <Input
                                        name="AMOUNT"
                                        placeholder="Amount"
                                        value={values.AMOUNT}
                                        onChange={handleChange}
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
                                    help={touched.PARENT_GROUP_ID && errors.PARENT_GROUP_ID ? errors.PARENT_GROUP_ID : ""}
                                    validateStatus={touched.PARENT_GROUP_ID && errors.PARENT_GROUP_ID ? "error" : undefined}
                                >
                                    <span className="text-xs">Account Group</span>
                                    <Select
                                        showSearch
                                        placeholder="Select PARENT GROUP name"
                                        onChange={(value) => {
                                            // Set PARENT_GROUP_ID
                                            setFieldValue("PARENT_GROUP_ID", value);

                                            // Fetch or update CATEGORY_ID options based on PARENT_GROUP_ID
                                            // For example, dispatch an action to fetch related categories
                                            // This assumes you have a function to fetch categories based on parent group ID
                                            dispatch(getAssetCategory(value));
                                        }}
                                        value={values.PARENT_GROUP_ID}
                                        className="h-[40px] rounded"
                                    >
                                        {assetgroupList?.map((parentgroup) => (
                                            <Option
                                                key={parentgroup.ID}
                                                value={parentgroup.ID}
                                                className="text-gray-400"
                                            >
                                                {parentgroup.NAME}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>




                            <Col span={12}>
                                <Form.Item
                                    className="flex flex-col"
                                    help={touched.CATEGORY_ID && errors.CATEGORY_ID ? errors.CATEGORY_ID : ""}
                                    validateStatus={touched.CATEGORY_ID && errors.CATEGORY_ID ? "error" : undefined}
                                >
                                    <span className="text-xs">From Account</span>
                                    <Select
                                        showSearch
                                        placeholder="Select Category name"
                                        onChange={(value) => setFieldValue("CATEGORY_ID", value)}
                                        value={values.CATEGORY_ID}
                                        className="h-[40px] rounded"
                                    >
                                        {categoryList?.map((category) => (
                                            <Option
                                                key={category.ID}
                                                value={category.ID}
                                                className="text-gray-400"
                                            >
                                                {category.NAME}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>


                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    className="flex flex-col"
                                    help={touched.PARENT_GROUP_ID && errors.PARENT_GROUP_ID ? errors.PARENT_GROUP_ID : ""}
                                    validateStatus={touched.PARENT_GROUP_ID && errors.PARENT_GROUP_ID ? "error" : undefined}
                                >
                                    <span className="text-xs">Account Group</span>
                                    <Select
                                        showSearch
                                        placeholder="Select PARENT GROUP name"
                                        onChange={(value) => setFieldValue("PARENT_GROUP_ID", value)}
                                        value={values.PARENT_GROUP_ID}
                                        className="h-[40px] rounded"
                                    >
                                        {assetgroupList?.map((parentgroup) => (
                                            <Option
                                                key={parentgroup.ID}
                                                value={parentgroup.ID}
                                                className="text-gray-400"
                                            >
                                                {parentgroup.NAME}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>



                            <Col span={12}>
                                <Form.Item
                                    className="flex flex-col"
                                    help={touched.CATEGORY_ID && errors.CATEGORY_ID ? errors.CATEGORY_ID : ""}
                                    validateStatus={touched.CATEGORY_ID && errors.CATEGORY_ID ? "error" : undefined}
                                >
                                    <span className="text-xs">To Account</span>
                                    <Select
                                        showSearch
                                        placeholder="Select Category name"
                                        onChange={(value) => setFieldValue("CATEGORY_ID", value)}
                                        value={values.CATEGORY_ID}
                                        className="h-[40px] rounded"
                                    >
                                        {categoryList?.map((category) => (
                                            <Option
                                                key={category.ID}
                                                value={category.ID}
                                                className="text-gray-400"
                                            >
                                                {category.NAME}
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
                                        touched.NARRATION && errors.NARRATION
                                            ? errors.NARRATION
                                            : ""
                                    }
                                    validateStatus={
                                        touched.NARRATION && errors.NARRATION
                                            ? "error"
                                            : undefined
                                    }
                                >
                                    <span className="text-xs">Narration</span>
                                    <TextArea
                                        rows={4}
                                        placeholder="Narration"
                                        maxLength={6000}
                                        name="NARRATION" // Ensure this matches the field name in initialValues and validationSchema
                                        value={values.NARRATION}
                                        onChange={handleChange} // Make sure handleChange is correctly passed
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    className="flex flex-col"
                                    help={
                                        touched.STATUS && errors.STATUS
                                            ? errors.STATUS
                                            : ""
                                    }
                                    validateStatus={
                                        touched.STATUS && errors.STATUS
                                            ? "error"
                                            : undefined
                                    }
                                >
                                    <span className="text-xs">Status</span>
                                    <div style={{ marginTop: 8 }}>
                                        <Switch
                                            checked={values.STATUS}
                                            onChange={(checked) => setFieldValue("STATUS", checked)}
                                            defaultChecked
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
                                    >
                                        {edit ? "Update" : "Submit"}
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </FormikForm>
                )}
            </Formik>
        </div>
    );
};

export default AssetForm;
