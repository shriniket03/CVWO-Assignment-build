import { errorHandler } from "./posts";
import { LoginUser, Token, SignUpUser } from "../types/User";
import axios from "axios";
// import { request } from "http";

export const loginUser = async (params: LoginUser): Promise<Token> => {
    try {
        const request = await axios.post(`/api/login`, params);
        const output = await request.data.payload.data;
        return output;
    } catch (e) {
        throw errorHandler(e as Error);
    }
};

export const verifyToken = async (token: string): Promise<string> => {
    try {
        await axios.post(`/api/verify`, [], createHeader(token));
        return "";
    } catch (e) {
        throw errorHandler(e as Error);
    }
};

export const signUpUser = async (params: SignUpUser): Promise<string> => {
    try {
        const request = await axios.post(`/api/users`, params);
        const output = await request.data.payload.data.username;
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
