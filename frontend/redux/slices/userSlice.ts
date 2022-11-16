import { createSlice } from "@reduxjs/toolkit";

export interface User {
    userProfile?: {
        token?: string,
        type?: number,
        id?: number;
        image?: string;
        name?: string;
        email?: string;
        phone?: string;
    }
}

const initialState: User = {
  userProfile: null
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser(state, action) {
        return action.payload;
    },
    deleteUser() {
        return initialState;
    },
    updateUserProfile(state, action){
        state.userProfile = action.payload.userProfile
    },
  },
});

export const { addUser, deleteUser, updateUserProfile } = userSlice.actions
export default userSlice.reducer
