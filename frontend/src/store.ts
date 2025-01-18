import postReducer, {
    setPosts,
    sortByLikes,
    appendPost,
    sortByDate,
    likePost,
    removePost,
    editPost,
} from "./reducers/postReducer";
import notifReducer, { setNotification, closeNotification } from "./reducers/notifReducer";
import tokenReducer, { setToken, setValidToken, removeToken } from "./reducers/tokenReducer";
import filterReducer, { setFilter } from "./reducers/filterReducer";
import commentsReducer, { setComments, appendComment, removeComment } from "./reducers/commentsReducer";

import {
    InitPostsAction,
    SetNotifAction,
    updateAction,
    SetTokenAction,
    validateTokenAction,
    AddPostAction,
    PostAction,
    FilterPostAction,
    InitComments,
    CommentAction,
    AddCommentAction,
} from "./types/Action";

import postService from "./services/posts";
import commentService from "./services/comments";
import { Comment } from "./types/Comments";
import { Token } from "./types/User";
import { Post } from "./types/Post";
import { configureStore } from "@reduxjs/toolkit";
import { Dispatch } from "react";

const store = configureStore({
    reducer: {
        posts: postReducer,
        notifications: notifReducer,
        token: tokenReducer,
        filter: filterReducer,
        comments: commentsReducer,
    },
});

export const initialisePosts = () => {
    return async (dispatch: Dispatch<InitPostsAction>) => {
        try {
            const res = await postService.getAll();
            dispatch(setPosts(res));
        } catch (err) {
            throw new Error((err as Error).message);
        }
    };
};

export const sortPostsLikes = () => {
    return async (dispatch: Dispatch<updateAction>) => {
        dispatch(sortByLikes());
    };
};

export const sortPostDate = () => {
    return async (dispatch: Dispatch<updateAction>) => {
        dispatch(sortByDate());
    };
};

export const addPostLike = (id: number, token: string) => {
    return async (dispatch: Dispatch<PostAction>) => {
        await postService.likePost(id, token);
        dispatch(likePost(id));
    };
};

export const deletePost = (id: number, token: string) => {
    return async (dispatch: Dispatch<PostAction>) => {
        await postService.deletePost(id, token);
        dispatch(removePost(id));
    };
};

export const addPost = (post: Post) => {
    return async (dispatch: Dispatch<AddPostAction>) => {
        dispatch(appendPost(post));
    };
};

export const modifyPost = (amended: Post) => {
    return async (dispatch: Dispatch<AddPostAction>) => {
        dispatch(editPost(amended));
    };
};

export const modifyFilter = (search: string) => {
    return async (dispatch: Dispatch<FilterPostAction>) => {
        dispatch(setFilter(search));
    };
};

export const setErrorMessage = (msg: string) => {
    return async (dispatch: Dispatch<SetNotifAction>) => {
        dispatch(setNotification({ type: "error", msg: msg, open: true }));
    };
};

export const setSuccessMessage = (msg: string) => {
    return async (dispatch: Dispatch<SetNotifAction>) => {
        dispatch(setNotification({ type: "success", msg: msg, open: true }));
    };
};

export const closeMessage = () => {
    return async (dispatch: Dispatch<updateAction>) => {
        dispatch(closeNotification());
    };
};

export const initToken = (token: Token) => {
    return async (dispatch: Dispatch<SetTokenAction>) => {
        dispatch(setToken(token));
    };
};

export const validateToken = (validity: boolean) => {
    return async (dispatch: Dispatch<validateTokenAction>) => {
        dispatch(setValidToken(validity));
    };
};

export const logOut = () => {
    return async (dispatch: Dispatch<updateAction>) => {
        dispatch(removeToken());
    };
};

export const initComments = () => {
    return async (dispatch: Dispatch<InitComments>) => {
        try {
            const res = await commentService.getAll();
            dispatch(setComments(res));
        } catch (err) {
            throw new Error((err as Error).message);
        }
    };
};

export const addComment = (comment: Comment) => {
    return async (dispatch: Dispatch<AddCommentAction>) => {
        dispatch(appendComment(comment));
    };
};

export const deleteComment = (id: number, token: string) => {
    return async (dispatch: Dispatch<CommentAction>) => {
        await commentService.deleteComment(id, token);
        dispatch(removeComment(id));
    };
};

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
