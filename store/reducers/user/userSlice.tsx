import { createAction, createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { SetUserPayload } from './payloads';
import { LoadingStatus } from '../globalPayload';
import AuthService, { LoginRequest } from '../../../api/services/AuthService';
import { ResultResponse } from '../../../api/api';
import * as SecureStore from 'expo-secure-store';
import asikusServiceInstance from '../../../api/services/AsikusService';

type UserState = {
    username: string,
    email: string,
    avatar: string,
    age: number,
    token: string,
    loading: LoadingStatus,
    currentRequestId: string | undefined,
    error: string;
}

const initialState = {
    username: "",
    email: "",
    avatar: "",
    age: 0,
    token: "",
    loading: LoadingStatus.idle,
    currentRequestId: undefined,
    error: ""
} as UserState

const apiLoginThunk = createAsyncThunk<any, LoginRequest>(
    'users/login',
    async (payload, { rejectWithValue }) => {
        const result = await AuthService.Login(payload);

        if(result.success) {
            await SecureStore.setItemAsync("token", "SECRET_KEY");
            asikusServiceInstance.setToken("SECRET_KEY");
        }

        return result.success
            ? result.data
            : rejectWithValue(result.error);
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(apiLoginThunk.pending, (state, action: PayloadAction<undefined, string, {
                arg: LoginRequest;
                requestId: string;
                requestStatus: "pending";
            }, never> ) => {
                if (state.loading === LoadingStatus.idle) {
                    state.loading = LoadingStatus.pending
                    state.currentRequestId = action.meta.requestId
                }
                
            })
            .addCase(apiLoginThunk.fulfilled, (state, action:  PayloadAction<SetUserPayload, string, {
                arg: LoginRequest;
                requestId: string;
                requestStatus: "fulfilled"; 
            }, never>
            ) => {
                const { requestId } = action.meta
                if (state.loading === LoadingStatus.pending && state.currentRequestId === requestId) {
                    state.loading = LoadingStatus.idle;
                    state.currentRequestId = undefined;

                    state.age = action.payload.age;
                    state.username = action.payload.name;
                    state.email = action.payload.email;
                    state.avatar = action.payload.avatar;
                }
            })
            .addCase(apiLoginThunk.rejected, (state, action) => {
                const { requestId } = action.meta
                if (state.loading === LoadingStatus.pending && state.currentRequestId === requestId) {
                    state.loading = LoadingStatus.idle;
                    state.error = action.error.message || "";
                    state.currentRequestId = undefined
                }
            })
    },
})

export const userSliceActions = {...userSlice.actions, apiLoginThunk }

export default userSlice.reducer