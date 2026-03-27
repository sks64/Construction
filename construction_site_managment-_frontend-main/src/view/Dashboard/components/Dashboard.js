import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaBorderAll } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { ImUserTie } from "react-icons/im";
import { MdPersonAdd } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { Button } from "antd";
import { getDashboardCount } from "../store/dataSlice";
import * as XLSX from "xlsx";

const Dashboard = () => {
  const dispatch = useDispatch();

  const dashboardList =
    useSelector((state) => state?.dashboard?.data?.dashboardList) || {};

  const totalItems = dashboardList?.totalItems?.[0]?.cnt || 0;
  const totalOrders = dashboardList?.totalOrders?.[0]?.cnt || 0;
  const totalEmployees = dashboardList?.totalUsers?.[0]?.cnt || 0;
  const totalCustomers = dashboardList?.totalCustomers?.[0]?.cnt || 0;

  const fetchData = useCallback(() => {
    dispatch(getDashboardCount());
  }, [dispatch]);

  const exportToExcel = () => {
    const transformedData = [
      { Metric: "Available Items", Count: totalItems },
      { Metric: "Available Orders", Count: totalOrders },
      { Metric: "Employees", Count: totalEmployees },
      { Metric: "Customers", Count: totalCustomers },
    ];

    const ws = XLSX.utils.json_to_sheet(transformedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Overview");
    XLSX.writeFile(wb, "Dashboard_Overview.xlsx");
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="bg-white m-4 p-8 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <div className="text-xl font-bold !text-[#414141]">Overview</div>
            <div className="text-gray-500 mt-1">Resources Summary</div>
          </div>

          <div className="flex mt-4 md:mt-0">
            <div className="flex items-center">
              <Button
                className="py-4 px-6 font-medium border border-gray-300 flex items-center gap-2"
                onClick={exportToExcel}
              >
                <MdOutlineFileUpload />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between mt-10 gap-12 px-12">
          <div className="bg-[#FFE2E5] p-8 w-full  rounded-[20px]">
            <div className="bg-[#FA5A7D] w-[40px] h-[40px] rounded-full flex items-center justify-center">
              <AiFillProduct className="text-white text-[20px]" />
            </div>
            <p className="text-[24px] font-bold mt-6">{totalItems}</p>
            <p className="text-[16px] font-medium mt-[-3px]">Available Items</p>
          </div>

          <div className="bg-[#FFF4DE] p-8 w-full  rounded-[20px]">
            <div className="ml-[-6px] bg-[#FF947A] w-[40px] h-[40px] rounded-full flex items-center justify-center">
              <FaBorderAll className="text-white text-[20px]" />
            </div>
            <p className="text-[24px] font-bold mt-6">{totalOrders}</p>
            <p className="text-[16px] font-medium mt-[-3px]">
              Available Orders
            </p>
          </div>

          <div className="bg-[#DCFCE7] p-8 w-full  rounded-[20px]">
            <div className="ml-[-6px] bg-[#3CD856] w-[40px] h-[40px] rounded-full flex items-center justify-center">
              <MdPersonAdd className="text-white text-[20px]" />
            </div>
            <p className="text-[24px] font-bold mt-6">{totalEmployees}</p>
            <p className="text-[16px] font-medium mt-[-3px]">Employees</p>
          </div>

          <div className="bg-[#F3E8FF] p-8 w-full  rounded-[20px]">
            <div className="ml-[-6px] bg-[#BF83FF] w-[40px] h-[40px] rounded-full flex items-center justify-center">
              <RiCustomerService2Fill className="text-white text-[20px]" />
            </div>
            <p className="text-[24px] font-bold mt-6">{totalCustomers}</p>
            <p className="text-[16px] font-medium mt-[-3px]">Customers</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
