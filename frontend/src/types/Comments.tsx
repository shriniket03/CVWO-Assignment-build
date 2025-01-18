export interface Comment {
    ID: number;
    Content: string;
    Post: number;
    AuthUsername: string;
    AuthName: string;
    Time: number;
}

export interface CommentInput {
    content: string;
    post: number;
}
