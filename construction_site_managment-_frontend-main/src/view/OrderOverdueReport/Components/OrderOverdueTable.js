import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { getOverdueOrders, setTableData } from "../store/dataSlice";
import { useLocation } from "react-router-dom";
import { toggleNewDialog } from "../../Category/store/stateSlice";

const OrderOverdueTable = ({ selectedCustomerIds }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  const tableData = useSelector((state) => state.Reports.data.tableData) || {};
  const { pageIndex, pageSize, total } = tableData;

  const overdueOrdersData =
    useSelector((state) => state.Reports.data.reportsList?.data) || [];

  const fetchData = () => {
    setLoading(true);
    dispatch(
      getOverdueOrders({
        pageIndex,
        pageSize,
        CUSTOMER_ID: selectedCustomerIds,
      })
    ).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, pageIndex, pageSize, selectedCustomerIds]);

  const sortedData = [...overdueOrdersData].sort((a, b) => {
    const aSelected = selectedCustomerIds.includes(a.ID);
    const bSelected = selectedCustomerIds.includes(b.ID);

    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    dispatch(setTableData({ pageIndex: current, pageSize }));
  };

  const columns = [
    {
      title: <span className="text-gray-500">Customer Name</span>,
      dataIndex: "NAME",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Mobile No</span>,
      dataIndex: "MOBILE_NO",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
    {
      title: <span className="text-gray-500">Total Due Orders</span>,
      dataIndex: "TOTAL_DUE_ORDERS",
      width: 180,
      render: (text) => (
        <span className="text-gray-500 font-medium">{text}</span>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(getOverdueOrders({ pageIndex: 1, pageSize }));

        dispatch(setTableData({ pageIndex: 1, pageSize }));

        dispatch(toggleNewDialog(false));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.pathname, pageSize]);

  return (
    <>
      {loading ? (
        <div className="w-full flex justify-center h-80 items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ marginBottom: "16px" }}>
          <Table
            columns={columns}
            dataSource={sortedData}
            rowKey="ID"
            bordered
            pagination={{
              current: pageIndex,
              pageSize,
              total,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20],
              onShowSizeChange: handleTableChange,
            }}
            onChange={handleTableChange}
          />
        </div>
      )}
    </>
  );
};

export default OrderOverdueTable;
