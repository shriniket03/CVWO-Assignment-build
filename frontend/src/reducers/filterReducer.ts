import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: string = "";

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setFilter(state, action: PayloadAction<string>) {
            return action.payload;
        },
    },
});

export default filterSlice.reducer;
export const { setFilter } = filterSlice.actions;
