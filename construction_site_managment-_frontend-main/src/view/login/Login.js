import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Typography, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { apiLogin } from "../../services/AuthService";
import { persistor } from "../../store/index";

const Login = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onFinishFailed = (errorInfo) => {
    //console.log("Failed:", errorInfo);
  };

  const onFinish = async () => {
    try {
      setLoading(true);
      localStorage.clear();
      persistor.flush();
      persistor.purge();

      const response = await apiLogin({ username: username, password });
      //console.log("API Response:", response);

      if (response.status === 200) {
        const responseData = response.data;

        if (responseData.code == 200) {
          const user = responseData.data[0].token;
          localStorage.setItem("token", user);
          const userData = responseData.data[0].UserData;
          localStorage.setItem("UserData", JSON.stringify(userData));

          api.success({
            message: "Login Successfully",
          });

          setLoading(false);
          navigate("/dashboard");
          window.location.href = "/dashboard";
        } else if (responseData.code == 304) {
          api.info({
            message: " ",
            description: response.data.message || "Unauthorized User.",
          });
          setLoading(false);
        } else {
          api.error({
            message: "Error",
            description: "Unauthorized User.",
          });
          setLoading(false);
        }
      } else {
        api.error({
          message: "Error",
          description: "Unexpected error occurred.",
        });
      }
    } catch (err) {
      setLoading(false);
      api["error"]({
        message: "Error",
        description: err.message,
      });
    }
  };

  return (
    <div className="appBg">
      {contextHolder}
      <div className="loginForm">
        <h2 className="text-2xl font-bold mb-4 flex">
          Welcome <p className="text-3xl mt-[-6px]">&#128075;</p>
        </h2>
        <p className="text-gray-500 mb-4">Please Login to continue&#128071;</p>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Email",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item className="!mb-3">
            <Button
              type="primary"
              htmlType="submit"
              block
              className="btn"
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox>Remember me</Checkbox>
          </div>
          <div className="text-left text-xs text-blue-600">
            <Link>Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
