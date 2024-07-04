import  {configureStore}  from "@reduxjs/toolkit";
import userReducer from "./UserStore.js"

export const store=configureStore({
    reducer:userReducer,
})