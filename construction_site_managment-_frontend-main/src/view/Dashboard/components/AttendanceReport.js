import React, { useEffect, useState, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import ReactEcharts from "echarts-for-react";
import { getAttendanceDateWiseReport } from "../store/dataSlice";

const AttendanceReport = () => {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state?.dashboard?.data?.attendanceDateWiseReportList?.data || []
  );

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const FROM_DATE = `${year}-${month}-01`;
    const TO_DATE = `${year}-${month}-${day}`;

    dispatch(getAttendanceDateWiseReport({ FROM_DATE, TO_DATE }));
  }, []);

  //----------------------role wise switch START----------

  let ROLE_ID = localStorage.getItem("ROLE_ID");
  const userData = localStorage.getItem("UserData");
  // const roleDetails = JSON.parse(userData);

  let roleDetails = [];
  if (userData) {
    try {
      roleDetails = JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing UserData from localStorage", error);
    }
  }

  const EmpId = roleDetails[0]?.EMP_ID;

  const menuList = useSelector((state) => state?.menu?.data?.menuList?.data); // this line is important dont remove it

  const fetchData = useCallback(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const FROM_DATE = `${year}-${month}-01`;
    const TO_DATE = `${year}-${month}-${day}`;

    dispatch(getAttendanceDateWiseReport({ FROM_DATE, TO_DATE }));
  }, [ROLE_ID]);

  const fetchData4 = useCallback(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const FROM_DATE = `${year}-${month}-01`;
    const TO_DATE = `${year}-${month}-${day}`;

    dispatch(
      getAttendanceDateWiseReport({
        FROM_DATE,
        TO_DATE,
        REPORTING_HEAD_ID: [EmpId],
      })
    );
  }, [dispatch]);

  const fetchData10 = useCallback(() => {
    const filterData = JSON.parse(localStorage.getItem("filterData"));
    const branchIds = filterData?.[0]?.BRANCH_ID?.split(",")?.map(Number);
    const departmentids =
      filterData?.[0]?.DEPARTMENT_ID?.split(",")?.map(Number);

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const FROM_DATE = `${year}-${month}-01`;
    const TO_DATE = `${year}-${month}-${day}`;

    dispatch(
      getAttendanceDateWiseReport({
        FROM_DATE,
        TO_DATE,
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

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const FROM_DATE = `${year}-${month}-01`;
    const TO_DATE = `${year}-${month}-${day}`;

    dispatch(
      getAttendanceDateWiseReport({
        FROM_DATE,
        TO_DATE,
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

  const dates = data.map((item) => item.intermediate_date);
  const totalAttendance = data.map((item) => item.TOTAL_ATTENDENCE);
  const dayStarted = data.map((item) => item.DAY_STARTED);
  const dayEnded = data.map((item) => item.DAY_ENDED);

  const option = {
    title: {
      text: "Attendance Data",
      subtext: "June 2024",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Total Attendance", "Day Started", "Day Ended"],
    },
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ["line", "bar"] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    calculable: true,
    xAxis: [
      {
        type: "category",
        data: dates,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "Total Attendance",
        type: "bar",
        data: totalAttendance,
        markPoint: {
          data: [
            { type: "max", name: "Max" },
            { type: "min", name: "Min" },
          ],
        },
        markLine: {
          data: [{ type: "average", name: "Avg" }],
        },
      },
      {
        name: "Day Started",
        type: "bar",
        data: dayStarted,
        markPoint: {
          data: [
            { type: "max", name: "Max" },
            { type: "min", name: "Min" },
          ],
        },
        markLine: {
          data: [{ type: "average", name: "Avg" }],
        },
      },
      {
        name: "Day Ended",
        type: "bar",
        data: dayEnded,
        markPoint: {
          data: [
            { type: "max", name: "Max" },
            { type: "min", name: "Min" },
          ],
        },
        markLine: {
          data: [{ type: "average", name: "Avg" }],
        },
      },
    ],
  };

  return (
    <div className="bg-white m-4 p-8 rounded-xl">
      <ReactEcharts
        option={option}
        style={{ height: "600px", width: "100%" }}
      />
    </div>
  );
};

export default AttendanceReport;
