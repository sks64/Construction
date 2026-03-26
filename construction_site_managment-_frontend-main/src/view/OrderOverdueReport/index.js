import React, { useState } from "react";
import OrderOverdueTable from "./Components/OrderOverdueTable";
import OrderOverdueFilter from "./Components/OrderOverdueFilter";
import { injectReducer } from "../../store";
import ReportsReducer from "./store";
import { useDispatch, useSelector } from "react-redux";
import { getOverdueOrders } from "./store/dataSlice";
import { toggleReportDialog } from "./store/stateSlice";
import { FaFilter } from "react-icons/fa";
injectReducer("Reports", ReportsReducer);

const OrderOverdueReport = () => {
  const dispatch = useDispatch();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const dialog = useSelector((state) => state.Reports.state.reportDialog);
  const handleFilterClick = () => {
    if (dialog) {
      dispatch(toggleReportDialog(false));
    } else {
      dispatch(toggleReportDialog(true));
    }
  };
  return (
    <div className="bg-white m-4 p-8 rounded-xl">
      <div className="flex justify-between">
        <div className="text-xl font-semibold !text-[#414141]">
          Order Overdue Reports
        </div>

        <div className="flex mb-6 justify-between">
          <div
            className="bg-[#096CAE] p-[11.5px] rounded mr-4 text-white cursor-pointer"
            onClick={handleFilterClick}
          >
            <FaFilter />
          </div>
        </div>
      </div>
      {dialog && <OrderOverdueFilter />}
      <OrderOverdueTable selectedCustomerIds={selectedCustomerIds} />
    </div>
  );
};

export default OrderOverdueReport;
