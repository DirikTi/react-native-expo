import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from "axios";
import { API_URL, API_LOG_INFO, API_LOG_FAIL, API_LOG_URL } from '@env';

type LOG_INFO<T> = {
    url: string,
    payload: T,
    method: string,
    responseData: any,
    headers: any
}

type RESULT_ERROR<T> = {
    error: T,
    success: boolean,
    message: string
}

export type ResultResponse<T = any> = {
    success: boolean,
    data?: T,
    error: any,
    status: number
}

class Axios {
    protected readonly api: AxiosInstance;
    constructor (params: CreateAxiosDefaults) {
        this.api = axios.create(params);
    }
}

export default abstract class BaseAxios extends Axios {

    constructor(config: AxiosRequestConfig,
        logInfo = Boolean(API_LOG_INFO), logError = Boolean(API_LOG_FAIL), apiUrl: string | undefined = undefined
    ) {
        super({
            baseURL: apiUrl || API_URL,
            ...config,
        });

        const selfLogFuncs = { LogInfo: this.LogInfo };

        

        this.api.interceptors.response.use(
            logInfo ? null : function (response: AxiosResponse) {
                if (logInfo) {
                    selfLogFuncs.LogInfo({
                        url: response.config.url || "",
                        headers: response.headers,
                        method: response.config.method || "",
                        responseData: response.data,
                        payload: response.request
                    });
                    return response;
                }

                if (logError && response.status != 200) {
                    selfLogFuncs.LogInfo({
                        url: response.config.url || "",
                        headers: response.headers,
                        method: response.config.method || "",
                        responseData: response.data,
                        payload: response.request
                    });
                }

                return response;
            }
        )

    }

    static async handleRequest<T>(
        requestFn: any
    ): Promise<ResultResponse<T>> {
        try {
            const resp = await requestFn();

            return {
                success: true,
                data: resp.data,
                error: null,
                status: 200
            };
        } catch (error: any) {
            return {
                success: false,
                data: undefined,
                error: error,
                status: error?.response?.status || 101
            };
        }
    }

    private LogInfo<T = any>(log: LOG_INFO<T>, url: string = API_LOG_URL, headers: any = {}): void {
        this.api.post(url, log, {
            ...headers
        });
    }

    protected GetErrorModel<T>(error: T, message: string = ""): RESULT_ERROR<T> {
        return {
            error,
            success: false,
            message
        }
    }
}