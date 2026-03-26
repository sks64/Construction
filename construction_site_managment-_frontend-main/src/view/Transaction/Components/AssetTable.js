import React, { useEffect, useState, useCallback } from "react";
import { Button, Table, Pagination, Switch, Spin } from "antd";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { getAsset, putAsset } from "../store/dataSlice";
import { setSelectedAsset, toggleNewDialog } from "../store/stateSlice";
import { setTableData } from "../store/dataSlice";
const AssetTable = () => {
  const dispatch = useDispatch();

  const data = useSelector((state) => state?.asset?.data?.assetList?.data);
  const loading = useSelector((state) => state.asset.data.loading);

  ////console.log(data);

  const onEdit = async (record) => {
    dispatch(setSelectedAsset(record));
    dispatch(toggleNewDialog(true));
  };

  const onSwitch = async (record) => {
    const updatedRecord = { ...record, STATUS: record.STATUS === 1 ? 0 : 1 };
    await dispatch(putAsset(updatedRecord));
    dispatch(getAsset());
  };

  const { pageIndex, pageSize, total } = useSelector(
    (state) => state.asset.data.tableData
  );

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;

    dispatch(setTableData({ pageIndex: current, pageSize: pageSize }));
  };

  const fetchData = useCallback(() => {
    dispatch(getAsset({ pageIndex, pageSize }));
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
          <div className="flex items-center">
            <span
              onClick={() => onEdit(record)}
              className="text-2xl text-[#096CAE] cursor-pointer"
            >
              <MdEdit />
            </span>

            {/* <span className="text-2xl ml-2 text-red-500 cursor-pointer">
              <MdDelete />
            </span> */}
          </div>
        </>
      ),
    },
    {
      title: <span className="text-gray-500">Date</span>,
      dataIndex: "DATE",
      width: 240,
    },
    {
      title: <span className="text-gray-500">Amount</span>,
      dataIndex: "AMOUNT",
      width: 240,
    },
    {
      title: <span className="text-gray-500">Narration</span>,
      dataIndex: "NARRATION",
      width: 240,
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

export default AssetTable;
