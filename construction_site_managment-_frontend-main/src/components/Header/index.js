import React, { useEffect, useState } from "react";
import {
  Avatar,
  Flex,
  Typography,
  Dropdown,
  Menu,
  Select,
  Modal,
  notification,
  Tooltip,
} from "antd";

import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components";
import admin from "../../assets/images/role/admin.png";
import user from "../../assets/images/user/leader.jpg";
import employee from "../../assets/images/role/employee.png";
import leader from "../../assets/images/role/leader.png";

import role from "../../assets/images/role/roleChange.png";
import { useDispatch } from "react-redux";

// import { getMenu } from "../Sidebar/store/dataSlice";
import { useNavigate } from "react-router-dom";
import { GiCycle } from "react-icons/gi";
const { Option } = Select;

export const CustomHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const userData = localStorage.getItem("UserData");
  const roleDetails = JSON.parse(userData);
  //console.log(roleDetails);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    // const defaultRole = roleDetails[0].ROLE_DETAILS.find(
    //   (role) => role.ROLE_ID === 1
    // );
    // // if (defaultRole) {
    // //   handleRoleSelect(defaultRole.ROLE_ID, defaultRole.ROLE_NAME);
    // // }
    // if (defaultRole) {
    //   dispatch(getMenu({ ROLE_ID: defaultRole.ROLE_ID }));
    // }
  }, []);

  const handleClick = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleRoleSelect = (roleId, roleName) => {
    // dispatch(getMenu({ ROLE_ID: roleId }));
    api.success({
      message: `Successfully updated to ${roleName}`,
    });
    setIsModalVisible(false);
  };

  const roleImages = {
    Admin: admin,
    Employee: employee,
    Leader: leader,
    "HR Manager": leader,
  };

  return (
    <Flex align="center" justify="end">
      {contextHolder}
      <Flex align="center" justify="end">
        <Tooltip title="Click to choose roles">
          <div
            className="rounded-full w-10 mr-4 cursor-pointer"
            onClick={handleClick}
          >
            <GiCycle className="text-3xl" />
          </div>
        </Tooltip>
        <StyledModal
          title={<StyledModalTitle>Select Your Role</StyledModalTitle>}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          footer={null}
        >
          <ModalContent>
            {
              // roleDetails[0].ROLE_DETAILS.map(({ ROLE_ID, ROLE_NAME }) => (
              //   <RoleContainer
              //     key={ROLE_ID}
              //     onClick={() => handleRoleSelect(ROLE_ID, ROLE_NAME)}
              //   >
              //     <img
              //       src={roleImages[ROLE_NAME] || admin}
              //       alt={ROLE_NAME}
              //       className="role-image"
              //     />
              //     <RoleLabel>{ROLE_NAME}</RoleLabel>
              //   </RoleContainer>
              // ))
            }
          </ModalContent>
        </StyledModal>
        <StyledDropdown overlay={menu} trigger={["click"]}>
          <StyledAvatarContainer>
            <img src={user} alt="" className="avatar" />
          </StyledAvatarContainer>
        </StyledDropdown>
      </Flex>
    </Flex>
  );
};
const StyledDropdown = styled(Dropdown)``;

const StyledAvatarContainer = styled.div`
  width: 50px;
  height: 50px;
  background-color: #f0f0f0;
  border: 2px solid #1890ff;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;

  .avatar {
    width: 100%;
    height: 100%;
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-title {
    text-align: center;
    width: 100%;
  }
`;

const StyledModalTitle = styled.div`
  width: 100%;
  text-align: center;
`;

const ModalContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const RoleContainer = styled.div`
  text-align: center;
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  border: 2px solid #eee;
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
    border-color: #1890ff;
  }

  .role-image {
    width: 100px;
    height: 100px;
    cursor: pointer;
    margin-bottom: 10px;
  }
`;

const RoleLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
`;
