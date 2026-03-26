import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../store/dataSlice";

const UserSearch = ({ handleRefresh }) => {
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");

  ////console.log(searchQuery);
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const action = await dispatch(getUser({ SEARCH_FILTER: searchQuery }));

      if (action.payload.code === 200) {
        handleRefresh && handleRefresh();
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearchChange}
        className="px-2 py-2 border focus:outline-none focus:border-blue-500 rounded-s"
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      <div
        className="bg-[#096CAE] text-white mr-4 px-2.5 py-[11.5px] rounded-e cursor-pointer"
        onClick={handleSubmit}
      >
        <FaSearch className="text-white " />
      </div>
    </div>
  );
};

export default UserSearch;
