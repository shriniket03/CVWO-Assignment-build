import { Post, PostInput } from "../types/Post";
import axios, { AxiosError, isAxiosError } from "axios";

const baseUrl = "http://localhost:8000";

const getAll = async (): Promise<Post[]> => {
    try {
        const request = await axios.get(`${baseUrl}/api/posts`);
        const output = await request.data.payload.data;
        return output;
    } catch (e) {
        throw errorHandler(e as Error);
    }
};

const createPost = async (input: PostInput, auth: string): Promise<Post> => {
    try {
        const request = await axios.post(`${baseUrl}/api/posts`, input, createHeader(auth));
        const output = await request.data.payload.data;
        return output;
    } catch (e) {
        throw errorHandler(e as Error);
    }
};

const getPost = async (id: number): Promise<Post> => {
    try {
        const request = await axios.get(`${baseUrl}/api/posts/${id}`);
        const output = await request.data.payload.data;
        return output;
    } catch (e) {
        throw errorHandler(e as Error);
    }
};

const deletePost = async (id: number, auth: string): Promise<string> => {
    try {
        await axios.delete(`${baseUrl}/api/posts/${id}`, createHeader(auth));
        return "Success";
    } catch (e) {
        throw errorHandler(e as Error);
    }
};

const likePost = async (id: number, auth: string): Promise<Post> => {
    try {
        const request = await axios.patch(`${baseUrl}/api/likepost/${id}`, [], createHeader(auth));
        const output = await request.data.payload.data;
        return output;
    } catch (e) {
        throw errorHandler(e as Error);
    }
};

const modifyPost = async (id: number, auth: string, input: PostInput): Promise<Post> => {
    try {
        const request = await axios.patch(`${baseUrl}/api/posts/${id}`, input, createHeader(auth));
        const output = await request.data.payload.data;
        return output;
    } catch (e) {
        throw errorHandler(e as Error);
    }
};

function createHeader(token: string) {
    return { headers: { Authorization: `Bearer ${token}` } };
}

export function errorHandler(e: Error) {
    if (isAxiosError(e)) {
        const x = (e as AxiosError).response;
        if (x) {
            return new Error(JSON.stringify(x.data));
        } else {
            return new Error(`Error contacting DB.`);
        }
    } else {
        return new Error(`Some other error occurred. Try again later`);
    }
}

export default { getAll, createPost, getPost, deletePost, likePost, modifyPost };
