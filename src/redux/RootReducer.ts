import { combineReducers } from "@reduxjs/toolkit";
import cartSlice from "./features/cartSlice";
import authSlice from "./features/authSlice";

const rootReducer = combineReducers({
  cart: cartSlice,
  auth: authSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
