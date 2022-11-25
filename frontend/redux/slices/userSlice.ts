import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
    userProfile?: {
        token?: string,
        type?: number,
        id?: number;
        image?: string;
        name?: string;
        email?: string;
        phone?: string;
        theme?: string;
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
    updateTheme(state, action) {
        state.userProfile.theme = action.payload;
    },
    updateUserProfile(state, action){
        state.userProfile = action.payload.userProfile
        state.userProfile.theme == "light";
        AsyncStorage.setItem('token', action.payload.userProfile.token);
    },
  },
});

export const { addUser, deleteUser, updateUserProfile, updateTheme } = userSlice.actions
export default userSlice.reducer
