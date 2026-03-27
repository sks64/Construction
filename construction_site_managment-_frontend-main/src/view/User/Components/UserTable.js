import React, { useEffect, useState, useCallback } from "react";
import { Button, Table, Pagination, Switch, Spin } from "antd";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { getUser, putUser, deleteUser } from "../store/dataSlice";
import { setSelectedUser, toggleNewDialog } from "../store/stateSlice";
import { setTableData } from "../store/dataSlice";
import { useLocation } from "react-router-dom";
import { Modal, message } from "antd";

const UserTable = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const data = useSelector((state) => state.user.data.userList?.data);
  const loading = useSelector((state) => state.user.data.loading);

  const onEdit = async (record) => {
    dispatch(setSelectedUser(record));
    dispatch(toggleNewDialog(true));
  };

  const onDelete = async (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const action = await dispatch(deleteUser({ ID: record.ID }));
        if (action.payload.code === 200) {
          message.success("User deleted successfully");
          dispatch(getUser());
        } else {
          message.error(action.payload.message || "Failed to delete user");
        }
      },
    });
  };

  const onSwitch = async (record) => {
    const updatedRecord = { ...record, STATUS: record.STATUS === 1 ? 0 : 1 };
    await dispatch(putUser(updatedRecord));
    dispatch(getUser());
  };

  const { pageIndex, pageSize, total } = useSelector(
    (state) => state.user.data.tableData
  );

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    dispatch(setTableData({ pageIndex: current, pageSize: pageSize }));
  };

  const fetchData = useCallback(() => {
    dispatch(getUser({ pageIndex, pageSize }));
  }, [dispatch, pageIndex, pageSize]);

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(getUser({ pageIndex: 1, pageSize }));

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
      width: 240,
    },
    {
      title: <span className="text-gray-500">Mobile No</span>,
      dataIndex: "MOBILE_NO",
    },

    {
      title: <span className="text-gray-500">Email Id</span>,
      dataIndex: "EMAIL_ID",
    },

    {
      title: <span className="text-gray-500">Address</span>,
      dataIndex: "ADDRESS",
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
          scroll={{
            x: 1300,
          }}
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

export default UserTable;
