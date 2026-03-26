import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Customer from "../../view/Customer";
import User from "../../view/User/index";
import Item from "../../view/Item/index";
import Order from "../../view/Order/index";
import Category from "../../view/Category/index";
import OrderReturn from "../../view/Order/Components/OrderReturn";
//  import Orderrrr from "../../view/Orderrrr/index";
import OrderDetailform from "../../view/Orderrrr/components/OrderDetailForm";
import OrderOverdueReport from "../../view/OrderOverdueReport";
import Dashboardindex from "../../view/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/product" element={<Product />} /> */}
      <Route path="/customer" element={<Customer />} />
      <Route path="/dashboard" element={<Dashboardindex />} />
      <Route path="/order/details" element={<OrderDetailform />} />
      <Route path="/order" element={<Order />} />
      <Route path="/user" element={<User />} />
      <Route path="/Item" element={<Item />}></Route>
      <Route path="/order-return" element={<OrderReturn />} />
      <Route path="/category" element={<Category />}></Route>
      <Route
        path="/orderoverduereports"
        element={<OrderOverdueReport />}
      ></Route>
      {/* <Route path ="/orderrrr" element={<Orderrrr />}></Route> */}

      {/* <Route path="/*" element={<Navigate to="/login" />} /> */}
    </Routes>
  );
};

export default AppRoutes;
