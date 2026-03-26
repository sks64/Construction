import { combineReducers } from "@reduxjs/toolkit";
import state from "./stateSlice";
import data from "./dataSlice";

const Accountreducer = combineReducers({
  state,
  data,
});

export default Accountreducer;
