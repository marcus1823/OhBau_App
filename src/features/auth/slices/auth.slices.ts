import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { role } from "../types/auth.types";

interface AuthState {
    role: role | null;
    accessToken: string | null;
    accountId?: string | null; // Optional field for account ID
}

const initialState: AuthState = {
    role: null,
    accessToken: null,
    accountId: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setRole: (state, action: PayloadAction<role>) => {
            state.role = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setAccountId: (state, action: PayloadAction<string>) => {
            state.accountId = action.payload;
        },
        clearAuthData: (state) => {
            state.role = null;
            state.accessToken = null;
        },
    },
});
export const { setRole, setAccessToken, setAccountId, clearAuthData } = authSlice.actions;
export default authSlice.reducer;