import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDashboardSaleReport } from "../store/dataSlice";

const SalesOverview = () => {
  const dispatch = useDispatch();

  const saleList = useSelector(
    (state) => state?.dashboard?.data?.saleList || {}
  );
  console.log("saleList", saleList);

  const fetchData = useCallback(() => {
    dispatch(getDashboardSaleReport());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentMonthSale = saleList.currentMonthSale?.[0]?.SALE_AMOUNT || 0;
  const currentYearSale = saleList.currentYearSale?.[0]?.SALE_AMOUNT || 0;
  const todaysSale = saleList.todaysSale?.[0]?.SALE_AMOUNT || 0;

  return (
    <div className="bg-white m-4 p-8 rounded-xl">
      <div className=" flex-col md:flex-row justify-between mb-6">
        <div className="flex flex-col items-center mb-8">
          <div className="text-2xl font-bold items-center text-gray-700">
            Sales Overview
          </div>
          <div className="text-gray-500 mt-1">Sales Summary</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
        {/* Today's Sales */}
        <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 w-full md:w-[250px] h-[220px] rounded-xl shadow-md border border-green-300 flex flex-col items-center justify-center">
          <div className="bg-green-500 w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-[28px]">₹</span>
          </div>
          <p className="text-[32px] font-bold mt-4 text-gray-800">
            ₹ {todaysSale.toLocaleString("en-IN")}
          </p>
          <p className="text-[20px] font-medium text-gray-600">Today's Sales</p>
        </div>

        {/* This Month's Sales */}
        <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 w-full md:w-[250px] h-[220px] rounded-xl shadow-md border border-orange-300 flex flex-col items-center justify-center">
          <div className="bg-orange-500 w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-[28px]">₹</span>
          </div>
          <p className="text-[32px] font-bold mt-4 text-gray-800">
            ₹ {currentMonthSale.toLocaleString("en-IN")}
          </p>
          <p className="text-[20px] font-medium text-gray-600">
            This Month's Sales
          </p>
        </div>

        {/* This Year's Sales */}
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 w-full md:w-[250px] h-[220px] rounded-xl shadow-md border border-purple-300 flex flex-col items-center justify-center">
          <div className="bg-purple-500 w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-[28px]">₹</span>
          </div>
          <p className="text-[32px] font-bold mt-4 text-gray-800">
            ₹ {currentYearSale.toLocaleString("en-IN")}
          </p>
          <p className="text-[20px] font-medium text-gray-600">
            This Year's Sales
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
