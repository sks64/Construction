import { combineReducers } from "@reduxjs/toolkit";
import state from "./stateSlice";
import data from "./dataSlice";

const Employeereducer = combineReducers({
  state,
  data,
});

export default Employeereducer;