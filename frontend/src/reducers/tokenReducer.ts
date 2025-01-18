import { type Token } from "../types/User";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {} as Token;

const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<Token>) {
            return action.payload;
        },
        setValidToken(state, action: PayloadAction<boolean>) {
            return { ...state, Valid: action.payload };
        },
        removeToken() {
            return {} as Token;
        },
    },
});

export default tokenSlice.reducer;
export const { setToken, setValidToken, removeToken } = tokenSlice.actions;
