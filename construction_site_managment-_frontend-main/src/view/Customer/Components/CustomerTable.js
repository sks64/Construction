import React, { useEffect, useCallback } from "react";
import { Button, Table, Switch, Spin } from "antd";
import { MdEdit } from "react-icons/md";
import { PiContactlessPaymentBold } from "react-icons/pi";
import { useSelector, useDispatch } from "react-redux";
import { getCustomer, putCustomer } from "../store/dataSlice";
import { setSelectedCustomer, toggleNewDialog } from "../store/stateSlice";
import { setTableData } from "../store/dataSlice";
import { setSelectedOrder, togglefourthDialog } from "../store/stateSlice";
import { useLocation } from "react-router-dom";

const UserTable = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const data = useSelector(
    (state) => state?.customer?.data?.customerList?.data
  );
  const loading = useSelector((state) => state.customer.data.loading);
  const { pageIndex, pageSize, total } = useSelector(
    (state) => state.customer.data.tableData
  );

  const onEdit = (record) => {
    dispatch(setSelectedCustomer(record));
    dispatch(toggleNewDialog(true));
  };

  const onSwitch = async (record) => {
    const updatedRecord = { ...record, STATUS: record.STATUS === 1 ? 0 : 1 };
    await dispatch(putCustomer(updatedRecord));
    dispatch(getCustomer());
  };

  const onTransaction = (record) => {
    dispatch(setSelectedOrder(record));
    dispatch(togglefourthDialog(true));
  };

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    dispatch(setTableData({ pageIndex: current, pageSize: pageSize }));
  };

  const fetchData = useCallback(() => {
    dispatch(getCustomer({ pageIndex, pageSize }));
  }, [dispatch, pageIndex, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(getCustomer({ pageIndex: 1, pageSize }));

        dispatch(setTableData({ pageIndex: 1, pageSize }));

        dispatch(toggleNewDialog(false));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.pathname, pageSize]);

  const columns = [
    {
      title: <span className="text-gray-500">Action</span>,
      dataIndex: "action",
      fixed: "left",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center">
          <span
            onClick={() => onEdit(record)}
            className="text-2xl text-[#096CAE] cursor-pointer"
          >
            <MdEdit />
          </span>
          <span
            onClick={() => onTransaction(record)}
            className="text-xl text-[#096CAE] cursor-pointer ml-2"
          >
            <PiContactlessPaymentBold />
          </span>
        </div>
      ),
    },
    {
      title: <span className="text-gray-500">Name</span>,
      dataIndex: "NAME",
      width: 240,
    },
    {
      title: <span className="text-gray-500">Mobile No</span>,
      dataIndex: "MOBILE_NO",
    },
    {
      title: <span className="text-gray-500">Address</span>,
      dataIndex: "ADDRESS",
    },
    {
      title: <span className="text-gray-500">Pan Card</span>,
      dataIndex: "PAN_CARD",
    },
    {
      title: <span className="text-gray-500">Adhar Card</span>,
      dataIndex: "ADHAR_CARD",
    },
    {
      title: <span className="text-gray-500">Status</span>,
      dataIndex: "STATUS",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Switch
          checked={record.STATUS === 1}
          onChange={() => onSwitch(record)}
        />
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <div className="w-full flex justify-center h-60 items-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          bordered
          scroll={{ x: 1300 }}
          pagination={{
            current: pageIndex,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
            onChange: handleTableChange,
          }}
          onChange={handleTableChange}
        />
      )}
    </>
  );
};

export default UserTable;
