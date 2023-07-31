import BaseAxios, { ResultResponse } from "../api";
import { AxiosRequestConfig } from "axios";
import { API_URL, API_LOG_FAIL, API_LOG_URL } from '@env';

export interface LoginRequest {
    email: string,
    password: string
}

export interface RegisterRequest {
    username: string,
    email: string,
    password: string
}

class AuthService extends BaseAxios {

    constructor(config: AxiosRequestConfig) {
        super(config, false, false);
    }

    async Login(payload: LoginRequest): Promise<ResultResponse> {
        return AuthService.handleRequest(async () => {
            return await this.api.post("/login.php", payload)
        });
    }

    async Register(payload: RegisterRequest): Promise<ResultResponse> {
        return AuthService.handleRequest<ResultResponse>(() =>
            this.api.post("/register", payload)
        );
    }
}

export default new AuthService({
    baseURL: API_URL,
});