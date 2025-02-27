import { errorHandler } from "./posts";
import { Comment, CommentInput } from "../types/Comments";
import axios from "axios";

const getAll = async (): Promise<Comment[]> => {
    try {
        const request = await axios.get(`/api/comments`);
        const output = await request.data.payload.data;
        return output;
    } catch (e) {
        throw errorHandler(e as Error);
    }
};

const deleteComment = async (id: number, auth: string): Promise<string> => {
    try {
        await axios.delete(`/api/comments/${id}`, createHeader(auth));
        return "Success";
    } catch (e) {
        throw errorHandler(e as Error);
    }
};

const createComment = async (input: CommentInput, auth: string): Promise<Comment> => {
    try {
        const comment = await axios.post(`/api/comments`, input, createHeader(auth));
        const output = await comment.data.payload.data;
        return output;
    } catch (e) {
        throw errorHandler(e as Error);
    }
};

function createHeader(token: string) {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

export default { getAll, deleteComment, createComment };
