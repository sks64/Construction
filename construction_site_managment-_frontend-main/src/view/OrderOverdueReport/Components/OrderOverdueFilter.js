import React, { useEffect, useState, useCallback } from "react";
import { Button, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { toggleReportDialog } from "../store/stateSlice";
import {
  getCustomer,
  getOverdueOrders,
  setTableData,
} from "../store/dataSlice";

const { Option } = Select;
const OrderOverdueFilter = () => {
  const dispatch = useDispatch();

  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [selectedOrderType, setSelectedOrderType] = useState(null);
  const { pageIndex, pageSize } = useSelector(
    (state) => state.Reports.data?.tableData
  );
  const dialog = useSelector((state) => state.Reports.state.reportDialog);
  const tableData = useSelector((state) => state.Reports.data.tableData);

  const customerList = useSelector(
    (state) => state.Reports.data.customerList?.data
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
      getOverdueOrders({
        pageIndex,
        pageSize,
        CUSTOMER_ID: selectedCustomer,
      })
    );
  };
  const fetchData = useCallback(() => {
    dispatch(getOverdueOrders(tableData));
  }, [dispatch, pageIndex, pageSize]);

  useEffect(() => {
    if (dialog) {
      dispatch(getCustomer());
    }
    fetchData();
  }, [pageIndex, pageSize]);
  const handleClear = () => {
    dispatch(setTableData(tableData));
    dispatch(
      getCustomer({
        ...tableData,
        CUSTOMER_ID: "",
      })
    );
    dispatch(toggleReportDialog(false));
    dispatch(getOverdueOrders({ pageIndex: 1, pageSize }));
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
              mode="multiple"
              filterOption={filterOption}
              className="w-full "
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
        <div></div>
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

export default OrderOverdueFilter;
