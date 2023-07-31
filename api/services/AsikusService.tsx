import BaseAxios, { ResultResponse } from "../api";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import { GuestType } from "../../store/reducers/guest/guestSlice";

class AsikusService extends BaseAxios {

    static REQ_TIMEOUT = 6666; 
    
    constructor(config: AxiosRequestConfig, token?: string) {
        super({
            ...config,
            timeout: AsikusService.REQ_TIMEOUT,
        }, false, false);

        this.setToken(token);
    }

    public async setToken(token?: string) {
        if(token) {
            this.api.defaults.headers.common["Authorization"] = "Bearer " + token;
            return true;
        }

        try {
            const result = await SecureStore.getItemAsync("token");
            this.api.defaults.headers.common["Authorization"] = "Bearer " + result;

            return true;
        } catch (error) {
            console.log("FUCK SHIT", error);
            return false;
        }
    }

    guests = new class {
        private parent: AxiosInstance;
 
        constructor(parent: AxiosInstance) {
            this.parent = parent;
        }

        public async getAll(): Promise<ResultResponse<GuestType[]>> {
            return AsikusService.handleRequest(async () => {
                const resp = await this.parent.get("/intro.json");
                return resp;
            });
        }
    }(this.api);
}

const asikusServiceInstance = new AsikusService({
    baseURL: API_URL
});

export default asikusServiceInstance;