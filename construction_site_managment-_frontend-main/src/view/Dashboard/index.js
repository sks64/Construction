import React from "react";

import Dashboard from "./components/Dashboard";
import SalesOverview from "./components/SalesOverview";
import TopsellerTable from "./components/TopsellerTable";
import OrderBarChart from "./components/OrderBarChart";
import Dashboardreducer from "./store";
import { injectReducer } from "../../store";
injectReducer("dashboard", Dashboardreducer);

const Dashboardindex = () => {
  return (
    <>
      <Dashboard />
      <OrderBarChart />

      <TopsellerTable />
      <SalesOverview />
    </>
  );
};

export default Dashboardindex;
