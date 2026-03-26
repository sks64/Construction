import React, { useEffect, useState, useCallback } from "react";
import { Button, Select, DatePicker, Space, Radio } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { toggleNewDialog, toggleFilterDialog } from "../store/stateSlice";
import { getOrder, getCustomer, setTableData } from "../store/dataSlice";

const { Option } = Select;
const OrderFilter = () => {
  const dispatch = useDispatch();

  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [selectedOrderType, setSelectedOrderType] = useState(null);
  const { pageIndex, pageSize } = useSelector(
    (state) => state.Order.data.tableData
  );

  const tableData = useSelector((state) => state.Order.data.tableData);
  const filterDialog = useSelector((state) => state.Order.state.filterDialog);
  const customerList = useSelector(
    (state) => state.Order.data.customerList?.data
  );

  console.log("customer", customerList);
  const filterOption = (input, option) => {
    const optionText = option.children;
    return (typeof optionText === "string" ? optionText : optionText.join(""))
      .toLowerCase()
      .includes(input.toLowerCase());
  };

  const handleSubmit = () => {
    dispatch(
      getOrder({
        ...tableData,
        CUSTOMER_ID: selectedCustomer,
        ORDER_TYPE: selectedOrderType,
      })
    );
  };
  const fetchData = useCallback(() => {
    dispatch(getCustomer(tableData));
  }, [dispatch, pageIndex, pageSize]);

  useEffect(() => {
    if (filterDialog) {
      fetchData();
    }
  }, [pageIndex, pageSize]);
  const handleClear = () => {
    dispatch(setTableData(tableData));
    dispatch(
      getOrder({
        ...tableData,
        CUSTOMER_ID: "",
        ORDER_TYPE: "",
      })
    );
    dispatch(toggleFilterDialog(false));
    dispatch(getOrder({ pageIndex: 1, pageSize }));
  };

  // console.log("handle clear", handleClear);
  return (
    <div className="p-4 bg-white rounded border border-dashed mt-4 mb-8">
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="col-span-4 md:col-span-1">
          <label className="block mb-1 font-semibold text-gray-500">
            Customer
          </label>
          <div className="">
            <Select
              showSearch
              filterOption={filterOption}
              className="w-full h-11 "
              placeholder="Select Customer"
              onChange={(value) => setSelectedCustomer(value)}
            >
              {customerList?.map((item) => (
                <Option key={item.ID} value={item.ID}>
                  {item.NAME}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex  flex-col justify-center items-center">
          <div>
            <label className="block mb-1 font-semibold text-gray-500">
              Order Type
            </label>
            <Radio.Group
              className="mb-4"
              onChange={(e) => setSelectedOrderType(e.target.value)}
            >
              <Radio value="S">Sale</Radio>
              <Radio value="R">Rent</Radio>
            </Radio.Group>
          </div>
        </div>
        <div></div>
        <div className="flex items-end justify-end mb-4 mt-6">
          <div className="flex">
            <Button
              type="default"
              className="mr-4 py-4 px-6 border border-blue-500"
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              type="primary"
              className="py-4 px-6"
              onClick={() => {
                handleSubmit();
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFilter;
