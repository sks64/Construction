import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactEcharts from "echarts-for-react";
import { getOrderDatewiseReport } from "../store/dataSlice";

const AttendanceReport = () => {
  const dispatch = useDispatch();

  const fetchData = useCallback(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const FROM_DATE = `${year}-${month}-01`;
    const TO_DATE = `${year}-${month}-${day}`;

    dispatch(getOrderDatewiseReport({ FROM_DATE, TO_DATE }));
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const datewiseList = useSelector(
    (state) => state?.dashboard?.data?.datewiseList?.data || []
  );

  // console.log("datewiseList", datewiseList);

  const dates = datewiseList.map((item) => item.intermediate_date);
  const counts = datewiseList.map((item) => item.TOTAL_ORDERS);

  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const option = {
    title: {
      text: "Order Data",
      subtext: "August 2024",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: {
        rotate: 45,
        formatter: function (value) {
          return value;
        },
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: Math.max(...counts) + 1,
      interval: 1,
      axisLabel: {
        formatter: function (value) {
          return value;
        },
      },
    },
    series: [
      {
        name: "Total Orders",
        type: "bar",
        data: counts,
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
        style={{ height: "500px", width: "100%" }}
      />
    </div>
  );
};

export default AttendanceReport;
