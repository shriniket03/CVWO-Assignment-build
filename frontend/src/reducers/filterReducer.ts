import { type PostFilter } from "../types/Post";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = { search: "", category: "" } as PostFilter;

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setSearch(state, action: PayloadAction<string>) {
            return { ...state, search: action.payload };
        },
        setCategory(state, action: PayloadAction<string>) {
            return { ...state, category: action.payload };
        },
    },
});

export default filterSlice.reducer;
export const { setSearch, setCategory } = filterSlice.actions;
