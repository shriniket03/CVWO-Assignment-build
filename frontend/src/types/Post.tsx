export interface Post {
    ID: number;
    AuthUsername: string;
    AuthName: string;
    Likes: number;
    Tag: string;
    Content: string;
    Time: number;
    Category: string;
}

export interface PostInput {
    tag: string;
    content: string;
    category: string;
}

export interface PostFilter {
    search: string;
    category: string;
}
