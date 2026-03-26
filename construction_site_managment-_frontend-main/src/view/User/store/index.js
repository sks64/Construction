import { combineReducers } from "@reduxjs/toolkit";
import state from "./stateSlice";
import data from "./dataSlice";

const Userreducer = combineReducers({
  state,
  data,
});

export default Userreducer;
