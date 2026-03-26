import { combineReducers } from "@reduxjs/toolkit";
import state from "./stateSlice";
import data from "./dataSlice";

const Orderreducer = combineReducers({
  state,
  data,
});

export default Orderreducer;
