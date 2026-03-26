import { combineReducers } from "@reduxjs/toolkit";
import state from "./stateSlice";
import data from "./dataSlice";

const ReportsReducer = combineReducers({
  state,
  data,
});

export default ReportsReducer;
