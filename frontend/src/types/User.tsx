export interface LoginUser {
    username: string;
    password: string;
}

export interface Token {
    Username: string;
    Token: string;
    Valid: boolean;
}

export interface SignUpUser {
    username: string;
    name: string;
    password: string;
}
