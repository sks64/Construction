import React from "react";
import { Menu, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { FaStackExchange } from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <>
      <Flex align="center" justify="center">
        {/* <div className="logo">
          <img src={logo} width={160} alt="" />
        </div> */}
      </Flex>
      <Menu
        mode="inline"
        className="menu-bar"
        defaultSelectedKeys={"/dashboard"}
        onClick={(items) => {
          navigate(items.key);
        }}
        items={[
          {
            key: "/dashboard",
            icon: <MdOutlineDashboardCustomize />,
            label: "Dashboard",
          },

          {
            key: "/customer",
            icon: <FaUser />,
            label: "Customer",
          },
          {
            key: "/order",
            icon: <FaShoppingCart />,
            label: "Order",
          },
          {
            key: "/category",
            icon: <FaList />,
            label: "Category",
          },
          {
            key: "/user",
            icon: <HiUserGroup />,
            label: "User",
          },
          {
            key: "/item",
            icon: <FaStackExchange />,
            label: "Item",
          },

          {
            key: "#",
            icon: <GiFarmer />,
            label: "Reports",
            children: [
              {
                key: "/orderoverduereports",
                label: "Order Overdue Report",
              },
            ],
          },
        ]}
      />
    </>
  );
};
