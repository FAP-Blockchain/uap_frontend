import { combineReducers } from "@reduxjs/toolkit";
import cartSlice from "./features/cartSlice";
import authSlice from "./features/authSlice";

const rootReducer = combineReducers({
  cart: cartSlice,
  auth: authSlice,
});

export default rootReducer;
