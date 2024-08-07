import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  User: [],
};

export const userStore = createSlice({
  name: "User",
  initialState,
  reducers: {
    userData: (state, action) => {
      const user = {
        id: nanoid(),
        data: action.payload,
      };
      state.User.push(user);
    },
    removeUser: (state, action) => {
      state.User = state.User.filter((user) => user.data._id !== action.payload._id);
    },
  },
});

export const { userData, removeUser } = userStore.actions;
export default userStore.reducer;
