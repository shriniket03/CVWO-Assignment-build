import { Notification } from "../types/Notification";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {} as Notification;

const notifSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification(state, action: PayloadAction<Notification>) {
            return action.payload;
        },
        closeNotification(state) {
            return { ...state, open: false };
        },
    },
});

export default notifSlice.reducer;
export const { setNotification, closeNotification } = notifSlice.actions;
