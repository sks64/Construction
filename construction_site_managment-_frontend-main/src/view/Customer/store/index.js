import { combineReducers } from "@reduxjs/toolkit";
import state from "./stateSlice";
import data from "./dataSlice";

const Customerreducer = combineReducers({
  state,
  data,
});

export default Customerreducer;