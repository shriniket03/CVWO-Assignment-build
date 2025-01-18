import { type Comment } from "../types/Comments";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: Comment[] = [];

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        setComments(state, action: PayloadAction<Comment[]>) {
            return action.payload;
        },
        appendComment(state, action: PayloadAction<Comment>) {
            state.push(action.payload);
        },
        removeComment(state, action: PayloadAction<number>) {
            return state.filter((comment) => comment.ID != action.payload);
        },
    },
});

export default commentsSlice.reducer;
export const { setComments, appendComment, removeComment } = commentsSlice.actions;
