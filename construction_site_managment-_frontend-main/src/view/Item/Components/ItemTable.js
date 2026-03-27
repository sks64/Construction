import React, { useEffect, useState, useCallback } from "react";
import { Button, Table, Pagination, Switch, Spin } from "antd";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { getItem, putItem, deleteItem } from "../store/dataSlice";
import { setSelectedItem, toggleNewDialog } from "../store/stateSlice";
import { setTableData } from "../store/dataSlice";
import { useLocation } from "react-router-dom";
import { Modal, message } from "antd";

const ItemTable = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const data = useSelector((state) => state?.item.data.itemList?.data);

  const loading = useSelector((state) => state.item.data.loading);

  const onEdit = async (record) => {
    dispatch(setSelectedItem(record));
    dispatch(toggleNewDialog(true));
  };

  const onDelete = async (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this item?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const action = await dispatch(deleteItem({ ID: record.ID }));
        if (action.payload.code === 200) {
          message.success("Item deleted successfully");
          dispatch(getItem());
        } else {
          message.error(action.payload.message || "Failed to delete item");
        }
      },
    });
  };

  let togglePromise = null;

  const onSwitch = async (record) => {
    if (togglePromise) {
      await togglePromise;
    }

    togglePromise = dispatch(
      putItem({ ...record, STATUS: record.STATUS === 1 ? 0 : 1 })
    );
    try {
      await togglePromise;
      dispatch(getItem());
    } catch (error) {
      console.error(error);
    } finally {
      togglePromise = null;
    }
  };

  const { pageIndex, pageSize, total } = useSelector(
    (state) => state.item.data.tableData
  );

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    dispatch(setTableData({ pageIndex: current, pageSize: pageSize }));
  };

  const fetchData = useCallback(() => {
    dispatch(getItem({ pageIndex, pageSize }));
  }, [dispatch, pageIndex, pageSize]);

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize]);

  const columns = [
    {
      title: <span className="text-gray-500">Action</span>,
      dataIndex: "action",
      fixed: "left",
      width: 100,
      render: (_, record) => (
        <>
          <div className="flex items-center space-x-2">
            <span
              onClick={() => onDelete(record)}
              className="text-2xl text-red-500 cursor-pointer"
            >
              <MdDelete />
            </span>
            <span
              onClick={() => onEdit(record)}
              className="text-2xl text-[#096CAE] cursor-pointer"
            >
              <MdEdit />
            </span>
          </div>
        </>
      ),
    },

    {
      title: <span className="text-gray-500">Name</span>,
      dataIndex: "NAME",
      width: 100,
    },
    {
      title: <span className="text-gray-500">Category Name</span>,
      dataIndex: "CATEGORY_NAME",
      width: 100,
    },
    {
      title: <span className="text-gray-500">Current Stock</span>,
      dataIndex: "CURRENT_STOCK",
      width: 100,
    },

    {
      title: <span className="text-gray-500">Rent Rate</span>,
      dataIndex: "RENT_RATE",
      width: 100,
      render(text, record) {
        return <span>₹{record.RENT_RATE}</span>;
      },
    },
    {
      title: <span className="text-gray-500">Sale Rate</span>,
      dataIndex: "SALE_RATE",
      width: 100,
      render(text, record) {
        return <span>₹{record.SALE_RATE}</span>;
      },
    },
    {
      title: <span className="text-gray-500">GST Percent</span>,
      dataIndex: "GST_PERCENT",
      width: 100,
      render(text, record) {
        return <span>{record.GST_PERCENT}%</span>;
      },
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(getItem({ pageIndex: 1, pageSize }));

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
        <div className="w-full flex justify-center h-60 items-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          bordered
          pagination={{
            current: pageIndex,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
          }}
          onChange={handleTableChange}
        />
      )}
    </>
  );
};

export default ItemTable;
