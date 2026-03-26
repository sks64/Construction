import React, { useEffect, useState } from "react";
import { Button, Table, Pagination, Switch } from "antd";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { getAccount, setTableData } from "../store/dataSlice";
import { setSelectedAccount, toggleNewDialog } from "../store/stateSlice";

const AccountTable = ({ handleRefresh }) => {
  const dispatch = useDispatch();

  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);

  // const handleTableChange = (pagination) => {
  //   setCurrentPage(pagination.current);
  //   setPageSize(pagination.pageSize);
  // };
  const tableData = useSelector((state) => state.account.data.tableData);
  const { pageIndex = 1, pageSize = 10 } = tableData || {};

  const fetchData = () => {
    dispatch(getAccount({ pageIndex, pageSize }));
  };
  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, handleRefresh]);

  const data = useSelector((state) => state.account.data.accountList.data);

  // //console.log(data);

  const onEdit = (record) => {
    dispatch(setSelectedAccount(record));
    dispatch(toggleNewDialog(true));
  };
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    // //console.log(current);
    dispatch(setTableData({ pageIndex: current, pageSize: pageSize }));
  };
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
      title: <span className="text-gray-500">Parent Name</span>,
      dataIndex: "PARENT_NAME",
    },
    {
      title: <span className="text-gray-500">Name</span>,
      dataIndex: "NAME",
      width: 150,
      // render: (_, record) => `${record.FIRST_NAME} ${record.LAST_NAME}`,
    },
    {
      title: <span className="text-gray-500">Name_Mr</span>,
      dataIndex: "NAME_MR",
    },
    {
      title: <span className="text-gray-500">Group Name</span>,
      dataIndex: "GROUP_NAME",
    },

    {
      title: <span className="text-gray-500">Opening Balance</span>,
      dataIndex: "OPENING_BALANCE",
    },
    {
      title: <span className="text-gray-500">Status</span>,
      dataIndex: "STATUS",
      width: 100,
      fixed: "right",
      render: (text, record) => {
        const handleChange = (checked) => {
          //console.log("Switch Changed to:", checked ? 1 : 0);
        };

        return <Switch checked={text === 1} onChange={handleChange} />;
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        onChange={handleTableChange}
        pagination={{
          current: pageIndex,
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20],
          onShowSizeChange: handleTableChange,
        }}
      />
    </>
  );
};

export default AccountTable;
