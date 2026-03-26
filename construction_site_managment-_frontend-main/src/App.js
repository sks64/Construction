import React, { useEffect, useState } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar/index";
import { CustomHeader } from "./components/Header/index";
import { Layout, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { HiOutlineMenu, HiOutlineMenuAlt2 } from "react-icons/hi";
import AppRoutes from "./components/Routes/index";
import Login from "./view/login/Login";
const { Sider, Header, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsCheckingToken(false);
  }, []);

  if (isCheckingToken) {
    return null; // or a loading spinner
  }
  // ////console.log(token);
  return (
    <>
      {!token ? (
        <Login />
      ) : (
        <Layout>
          <Sider
            theme="light"
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            className="sider"
            width={250}
          >
            <Sidebar />
          </Sider>
          <Layout>
            <Header className="header">
              <div className="trigger-btn">
                <Button
                  type="text"
                  icon={collapsed ? <HiOutlineMenu /> : <HiOutlineMenuAlt2 />}
                  onClick={() => setCollapsed(!collapsed)}
                  className="text-2xl"
                />
              </div>
              <CustomHeader />
            </Header>
            <Content className="content">
              <AppRoutes />
            </Content>
            <div className="bg-white">
              <div className="sticky bottom-0 p-4  flex justify-center text-center text-gray-500 font-semibold">
                <div>
                  <p className="flex">
                    &#169;2024 | Proudly Designed and Developed by
                    <a
                      href="https://5techg.com/"
                      className="ml-1 text-blue-500"
                      target="_blank"
                    >
                      5TechG Team,{" "}
                    </a>
                  </p>
                  <a
                    href="https://5techg.com/"
                    className="text-blue-500"
                    target="_blank"
                  >
                    Let's build together
                  </a>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
      )}
    </>
  );
}

export default App;
