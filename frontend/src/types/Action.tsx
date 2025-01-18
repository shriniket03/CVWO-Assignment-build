import { Post } from "./Post";
import { Notification } from "./Notification";
import { Token } from "./User";
import { Comment } from "./Comments";

export interface InitPostsAction {
    payload: Post[];
    type: string;
}

export interface SetNotifAction {
    payload: Notification;
    type: string;
}

export interface updateAction {
    payload: undefined;
    type: string;
}

export interface SetTokenAction {
    payload: Token;
    type: string;
}

export interface validateTokenAction {
    payload: boolean;
    type: string;
}

export interface AddPostAction {
    payload: Post;
    type: string;
}

export interface PostAction {
    payload: number;
    type: string;
}

export interface FilterPostAction {
    payload: string;
    type: string;
}

export interface InitComments {
    payload: Comment[];
    type: string;
}

export interface AddCommentAction {
    payload: Comment;
    type: string;
}

export interface CommentAction {
    payload: number;
    type: string;
}
