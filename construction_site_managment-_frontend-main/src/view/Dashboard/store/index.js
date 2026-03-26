import { combineReducers } from "@reduxjs/toolkit";
import state from "./stateSlice";
import data from "./dataSlice";

const Dashboardreducer = combineReducers({
  state,
  data,
});

export default Dashboardreducer;
