import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaBorderAll } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { ImUserTie } from "react-icons/im";
import { MdPersonAdd } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdOutlineHail } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { BsBuildingCheck } from "react-icons/bs";
import { Button, Modal } from "antd";
import { BsFillPeopleFill } from "react-icons/bs";
// import { BarChart } from '@mui/x-charts/BarChart';
import { getEmployeeSummaryReport, getLeavesdata } from "../store/dataSlice";

const BoxElement = () => {
  const dispatch = useDispatch();

  //    --------------------- ROLE ID SART ----------------------------

  let ROLE_ID = localStorage.getItem("ROLE_ID");
  const userData = localStorage.getItem("UserData");
  const roleDetails = JSON.parse(userData);
  const EmpId = roleDetails[0]?.EMP_ID;

  const menuList = useSelector((state) => state?.menu?.data?.menuList?.data); // this line is important dont remove it

  const fetchData = useCallback(() => {
    dispatch(getEmployeeSummaryReport());
    // dispatch(getLeavesdata());
  }, [ROLE_ID]);

  const fetchData4 = useCallback(() => {
    dispatch(getEmployeeSummaryReport({ REPORTING_HEAD_ID: [EmpId] }));
  }, [dispatch]);

  const fetchData10 = useCallback(() => {
    const filterData = JSON.parse(localStorage.getItem("filterData"));
    const branchIds = filterData?.[0]?.BRANCH_ID?.split(",")?.map(Number);
    const departmentids =
      filterData?.[0]?.DEPARTMENT_ID?.split(",")?.map(Number);

    dispatch(
      getEmployeeSummaryReport({
        BRANCH_ID: branchIds,
        DEPARTMENT_ID: departmentids,
      })
    );
  }, [dispatch]);

  const fetchData9 = useCallback(() => {
    const filterData = JSON.parse(localStorage.getItem("filterData"));
    const branchIds = filterData?.[0]?.BRANCH_ID?.split(",")?.map(Number);
    const departmentids =
      filterData?.[0]?.DEPARTMENT_ID?.split(",")?.map(Number);

    dispatch(
      getEmployeeSummaryReport({
        DEPARTMENT_ID: departmentids,
        BRANCH_ID: branchIds,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (ROLE_ID == 4) {
      fetchData4();
    } else if (ROLE_ID == 10) {
      fetchData10();
    } else if (ROLE_ID == 9) {
      fetchData9();
    } else {
      fetchData();
    }
  }, [ROLE_ID, menuList]);

  const dashboardList = useSelector(
    (state) => state?.dashboard?.data?.employeeSummaryList
  );

  // Function to get the total from a specific key in the dashboardList
  const getTotalFromList = (list, key) => {
    return list?.find((item) => item[key])?.[key];
  };

  const leaveCountTotal =
    getTotalFromList(dashboardList?.leaveCount, "TOTAL") || 0;
  const leaveAPPROVED =
    getTotalFromList(dashboardList?.leaveCount, "APPROVED") || 0;
  const leavePENDING =
    getTotalFromList(dashboardList?.leaveCount, "PENDING") || 0;
  const leaveREJECTED =
    getTotalFromList(dashboardList?.leaveCount, "REJECTED") || 0;

  const attendeceCount =
    getTotalFromList(dashboardList?.attendeceCount, "TOTAL") || 0;
  const attendeceSTARTED_COUNT =
    getTotalFromList(dashboardList?.attendeceCount, "STARTED_COUNT") || 0;
  const attendeceEND_COUNT =
    getTotalFromList(dashboardList?.attendeceCount, "END_COUNT") || 0;

  const employeeCount =
    getTotalFromList(dashboardList?.employeeCount, "TOTAL_EMPLOYEE") || 0;

  const departmentCount =
    getTotalFromList(dashboardList?.departmentCount, "TOTAL") || 0;
  const branchCount =
    getTotalFromList(dashboardList?.branchCount, "TOTAL") || 0;

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
              <Button className="py-4 px-6 font-medium border border-gray-300">
                <MdOutlineFileUpload />
                <p>Export</p>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between mt-10 space-y-4 md:space-y-0 md:space-x-4">
          <div className="bg-[#FFE2E5] p-6 w-full md:w-[200px] h-[198px] rounded-[20px]">
            <div className="ml-[-6px] bg-[#FA5A7D] w-[40px] h-[40px] rounded-full flex items-center justify-center">
              <MdOutlineHail className="text-white text-[20px]" />
            </div>

            <p className="text-[20px] md:text-[24px] font-bold mt-3">
              {JSON.stringify(leaveCountTotal)}
            </p>
            <p className="text-[14px] md:text-[16px] font-medium mt-[-3px]">
              Leaves
            </p>

            <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2 w-full">
              <p className="text-[10px] md:text-[12px] text-[#4079ED] font-medium">
                {JSON.stringify(leaveAPPROVED)} Approved
              </p>
              <p className="text-[10px] md:text-[12px] text-[#4079ED] font-medium">
                {JSON.stringify(leavePENDING)} Pending
              </p>
              <p className="text-[10px] md:text-[12px] text-[#4079ED] font-medium  ">
                {JSON.stringify(leaveREJECTED)} Rejected
              </p>
            </div>
          </div>

          <div className="bg-[#FFF4DE] p-6 w-full md:w-[200px] h-[198px] rounded-[20px]">
            <div className="ml-[-6px] bg-[#FF947A] w-[40px] h-[40px] rounded-full flex items-center justify-center">
              <FaCalendarAlt className="text-white text-[20px]" />
            </div>
            <p className="text-[24px] font-bold mt-6">
              {JSON.stringify(attendeceCount)}
            </p>
            <p className="text-[16px] font-medium mt-[-3px]">Attendance</p>

            <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2 w-full">
              <p className="text-[10px] md:text-[12px] text-[#4079ED] font-medium">
                {JSON.stringify(attendeceSTARTED_COUNT)} Started
              </p>
              <p className="text-[10px] md:text-[12px] text-[#4079ED] font-medium">
                {JSON.stringify(attendeceEND_COUNT)} Ended
              </p>
            </div>
          </div>

          <div className="bg-[#DCFCE7] p-6 w-full md:w-[200px] h-[198px] rounded-[20px]">
            <div className="ml-[-6px] bg-[#3CD856] w-[40px] h-[40px] rounded-full flex items-center justify-center">
              <BsFillPeopleFill className="text-white text-[20px]" />
            </div>
            <p className="text-[24px] font-bold mt-6">
              {JSON.stringify(employeeCount)}
            </p>
            <p className="text-[16px] font-medium mt-[-3px]">Employee</p>
            <p className="text-[12px] text-[#4079ED] font-bold mt-2">-------</p>
          </div>

          <div className="bg-[#F3E8FF] p-6 w-full md:w-[200px] h-[198px] rounded-[20px]">
            <div className="ml-[-6px] bg-[#BF83FF] w-[40px] h-[40px] rounded-full flex items-center justify-center">
              <BsBuildingCheck className="text-white text-[20px]" />
            </div>
            <p className="text-[24px] font-bold mt-6">
              {JSON.stringify(branchCount)}
            </p>
            <p className="text-[16px] font-medium mt-[-3px]">Branches</p>
            <p className="text-[12px] text-[#4079ED] font-bold mt-2">-------</p>
          </div>

          <div className="bg-[#e4eff6] p-6 w-full md:w-[200px] h-[198px] rounded-[20px]">
            <div className="ml-[-6px] bg-[#096CAE] w-[40px] h-[40px] rounded-full flex items-center justify-center">
              <RiCustomerService2Fill className="text-white text-[20px]" />
            </div>
            <p className="text-[24px] font-bold mt-6">
              {" "}
              {JSON.stringify(departmentCount)}{" "}
            </p>
            <p className="text-[16px] font-medium mt-[-3px]">Departments </p>
            <p className="text-[12px] text-[#4079ED] font-bold mt-2">-------</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoxElement;
