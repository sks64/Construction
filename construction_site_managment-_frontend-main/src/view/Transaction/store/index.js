import { combineReducers } from "@reduxjs/toolkit";
import state from "./stateSlice";
import data from "./dataSlice";

const Assetreducer = combineReducers({
  state,
  data,
});

export default Assetreducer;
