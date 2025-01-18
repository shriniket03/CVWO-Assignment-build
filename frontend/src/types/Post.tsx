export interface Post {
    ID: number;
    AuthUsername: string;
    AuthName: string;
    Likes: number;
    Tag: string;
    Content: string;
    Time: number;
}

export interface PostInput {
    tag: string;
    content: string;
}
