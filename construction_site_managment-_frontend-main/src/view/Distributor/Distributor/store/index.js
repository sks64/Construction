import { combineReducers } from "@reduxjs/toolkit";
import state from "./stateSlice";
import data from "./dataSlice";

const Distributorreducer = combineReducers({
  state,
  data,
});

export default Distributorreducer;
