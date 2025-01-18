import { Post } from "../types/Post";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: Post[] = [];

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setPosts(state, action: PayloadAction<Post[]>) {
            return action.payload;
        },
        sortByLikes(state) {
            return state.sort((a, b) => b.Likes - a.Likes);
        },
        sortByDate(state) {
            return state.sort((a, b) => b.Time - a.Time);
        },
        appendPost(state, action: PayloadAction<Post>) {
            state.push(action.payload);
        },
        likePost(state, action: PayloadAction<number>) {
            let elem = state.find((post) => post.ID === action.payload);
            elem = { ...(elem as Post), Likes: (elem as Post).Likes + 1 };
            const x = state.map((post) => (post.ID === action.payload ? elem : post));
            return x.sort((a, b) => b.Likes - a.Likes);
        },
        removePost(state, action: PayloadAction<number>) {
            return state.filter((post) => post.ID != action.payload);
        },
        editPost(state, action: PayloadAction<Post>) {
            return state.map((post) => (post.ID === action.payload.ID ? action.payload : post));
        },
    },
});

export default postsSlice.reducer;
export const { setPosts, sortByLikes, appendPost, sortByDate, likePost, removePost, editPost } = postsSlice.actions;
