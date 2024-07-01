import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  User: [],
};

export const userStore = createSlice({
  name: "User",
  initialState, // Corrected variable name
  reducers: {
    userData: (state, action) => {
      const user = {
        id: nanoid(),
        data: action.payload,
      };
      state.User.push(user);
    },
    removeUser: (state, action) => {
      state.User = state.User.filter((user) => user.id !== action.payload); // Corrected spelling of filter method
    },
  },
});
export const { userData, removeUser } = userStore.actions;

export default userStore.reducer;
