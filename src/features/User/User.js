import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        name: '',
        email: ''
    },
    reducers: {
        userData: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
        }
    }
});

export const { userData } = userSlice.actions;
export default userSlice.reducer;
