import { combineReducers } from "@reduxjs/toolkit";
import state from "./stateSlice";
import data from "./dataSlice";

const Itemreducer = combineReducers({
  state,
  data,
});

export default Itemreducer;
