import { combineReducers } from "@reduxjs/toolkit";
import state from "./stateSlice";
import data from "./dataSlice";

const Categoryreducer = combineReducers({
  state,
  data,
});

export default Categoryreducer;
