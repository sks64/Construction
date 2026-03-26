import { combineReducers } from "@reduxjs/toolkit";
import data from "./dataSlice";

const Menureducer = combineReducers({
  data,
});

export default Menureducer;
