import React, { useCallback, useEffect, useState } from "react";
import { Button, Select, DatePicker, Radio, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getDistributor, getOrder, setTableData } from "../store/dataSlice";
import { toggleNewDialog } from "../store/stateSlice";

import { useLocation } from "react-router-dom";
const { RangePicker } = DatePicker;

const OrderFilter = () => {
  const dispatch = useDispatch();
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  const [filters, setFilters] = useState({
    DISTRIBUTOR_ID: null,
    FROM_DATE: null,
    TO_DATE: null,
  });

  const dialog = useSelector((state) => state.order.state.newDialog);
  const distributor = useSelector(
    (state) => state.order.data.distributorList?.data
  );

  //console.log(distributor);

  //console.log(dialog);

  const { pageIndex, pageSize, total } = useSelector(
    (state) => state.order.data.tableData
  );

  const filterOption = (input, option) => {
    const optionText = option.children;
    return (typeof optionText === "string" ? optionText : optionText.join(""))
      .toLowerCase()
      .includes(input.toLowerCase());
  };

  const fetchData = useCallback(() => {
    const updatedFilters = {
      ...filters,
      pageIndex,
      pageSize,
    };

    dispatch(getOrder(updatedFilters));
  }, [dispatch, filters, pageIndex, pageSize]);

  useEffect(() => {
    fetchData();
    dispatch(getDistributor());
  }, [pageIndex, pageSize]);

  const handleChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));

    switch (key) {
      case "DISTRIBUTOR_ID":
        setSelectedDistributor(value);
        break;
      default:
        break;
    }
  };

  const handleDateChange = (dates, dateStrings) => {
    setSelectedDateRange(dates);
  };

  const handleSubmit = () => {
    const updatedFilters = {
      ...filters,
      FROM_DATE: selectedDateRange
        ? selectedDateRange[0].format("YYYY-MM-DD")
        : null,
      TO_DATE: selectedDateRange
        ? selectedDateRange[1].format("YYYY-MM-DD")
        : null,
      pageIndex,
      pageSize,
    };
    if (JSON.stringify(updatedFilters) !== JSON.stringify(filters)) {
      dispatch(getOrder(updatedFilters));
    }
  };

  const handleClear = () => {
    setFilters({
      DISTRIBUTOR_ID: null,
      FROM_DATE: null,
      TO_DATE: null,
    });
    setSelectedDistributor(null);
    setSelectedDateRange(null);
    dispatch(toggleNewDialog(false));

    dispatch(setTableData({ pageIndex: 1, pageSize }));
    dispatch(getOrder({ pageIndex: 1, pageSize }));
  };

  return (
    <>
      <div className="filter mb-4">
        {dialog && (
          <div className="p-4 bg-white rounded border border-dashed">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-4 md:col-span-1">
                <label className="block mb-1 font-semibold text-gray-500">
                  Distributor Name
                </label>
                <div className="">
                  <Select
                    showSearch
                    mode="multiple"
                    filterOption={filterOption}
                    className="w-full custom-select h-11"
                    placeholder="Select Distributor"
                    value={selectedDistributor}
                    onChange={(value) => handleChange("DISTRIBUTOR_ID", value)}
                  >
                    {distributor?.map((type) => (
                      <Select.Option key={type.ID} value={type.ID}>
                        {type.DISTRIBUTOR_FIRM_NAME}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="col-span-4 md:col-span-1">
                <label className="block mb-1 font-semibold text-gray-500">
                  Pick Date
                </label>
                <div className="">
                  <Space direction="vertical" size={12} className="w-full ">
                    <RangePicker
                      className="w-full h-11"
                      onChange={handleDateChange}
                    />
                  </Space>
                </div>
              </div>
              <div className="col-span-4 md:col-span-2 flex items-center justify-end mt-4">
                <div className="flex items-end justify-end">
                  <div className="flex">
                    <Button
                      type="default"
                      className="mr-4 py-5 px-8 border border-blue-500"
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                    <Button
                      type="primary"
                      className=" py-5 px-8"
                      onClick={() => {
                        handleSubmit(filters);
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderFilter;
