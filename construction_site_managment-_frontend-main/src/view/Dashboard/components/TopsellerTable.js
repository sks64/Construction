import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "antd";
import { gettopfivecustomers, gettopsellingitems } from "../store/dataSlice";
import { CrownOutlined } from "@ant-design/icons"; // Ant Design icon

const TopsellerTable = () => {
  const dispatch = useDispatch();

  const topitemList = useSelector(
    (state) => state?.dashboard?.data?.topitemList?.data || []
  );
  const topcustomerList = useSelector(
    (state) => state?.dashboard?.data?.topcustomerList?.data || []
  );

  const fetchData = useCallback(() => {
    dispatch(gettopsellingitems());
    dispatch(gettopfivecustomers());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const topItemsData = topitemList.map((item, index) => ({
    key: index,
    RANK: index + 1,
    NAME: item.NAME,
    TOTAL_SALE: item.TOTAL_SALE,
  }));

  const topCustomersData = topcustomerList.map((customer, index) => ({
    key: index,
    RANK: index + 1,
    NAME: customer.NAME,
    TOTAL_AMOUNT: customer.TOTAL_AMOUNT,
  }));

  const columns = [
    {
      title: <span className="text-[black]">Rank</span>,
      dataIndex: "RANK",
      width: 50,
      render: (text) =>
        text === 1 ? <CrownOutlined style={{ color: "#FFD700" }} /> : text,
      onHeaderCell: () => {
        return {
          style: {
            backgroundColor: "#F3E8FF",
            color: "white",
          },
        };
      },
    },
    {
      title: <span className="text-[black]">Top Five Selling Items</span>,
      dataIndex: "NAME",
      width: 120,
      onHeaderCell: () => {
        return {
          style: {
            backgroundColor: "#F3E8FF",
            color: "white",
          },
        };
      },
    },
    {
      title: <span className="text-[black]">Total Sale</span>,
      dataIndex: "TOTAL_SALE",
      width: 90,
      onHeaderCell: () => {
        return {
          style: {
            backgroundColor: "#F3E8FF",
            color: "white",
          },
        };
      },
    },
  ];

  const customerColumns = [
    {
      title: <span className="text-[black]">Rank</span>,
      dataIndex: "RANK",
      width: 50,
      render: (text) =>
        text === 1 ? <CrownOutlined style={{ color: "#FFD700" }} /> : text,
      onHeaderCell: () => {
        return {
          style: {
            backgroundColor: "#FFE2E5",
            color: "white",
          },
        };
      },
    },
    {
      title: <span className="text-[black]">Top Five Customers</span>,
      dataIndex: "NAME",
      width: 120,
      onHeaderCell: () => {
        return {
          style: {
            backgroundColor: "#FFE2E5",
            color: "white",
          },
        };
      },
    },
    {
      title: <span className="text-[black]">Total Amount</span>,
      dataIndex: "TOTAL_AMOUNT",
      width: 90,
      onHeaderCell: () => {
        return {
          style: {
            backgroundColor: "#FFE2E5",
            color: "white",
          },
        };
      },
    },
  ];

  return (
    <div className="bg-white m-5 p-8 rounded-xl">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="mt-6 lg:w-[600px] w-full">
          <div className="flex text-[22px] text-[#111827] font-bold">
            <p>Top Five Selling Items</p>
          </div>

          <div className="w-full mt-3">
            <Table
              className="w-full"
              columns={columns}
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
              dataSource={topItemsData}
              bordered
              pagination={false}
            />
          </div>
        </div>

        <div className="mt-6 lg:w-[600px] w-full">
          <div className="flex text-[22px] text-[#111827] font-bold">
            <p>Top Five Customers</p>
          </div>

          <div className="w-full mt-3">
            <Table
              className="w-full"
              columns={customerColumns}
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
              dataSource={topCustomersData}
              bordered
              pagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopsellerTable;
