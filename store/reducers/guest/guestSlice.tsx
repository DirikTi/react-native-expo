import { createAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice, nanoid } from '@reduxjs/toolkit'
import type { EntityState, PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { LoadingStatus } from '../globalPayload';
import { RootStateType, store } from '../../store';

export type GuestType = {
    id: number,
    name: string,
    email: string,
    age: number,
    city: string,
}


const guestsAdapter = createEntityAdapter<GuestType>({
    selectId: (guest) => guest.id,
    sortComparer: (a, b) => a.name.localeCompare(b.name),
})

const guestSlice = createSlice({
    name: 'guest',
    initialState: guestsAdapter.getInitialState({
        loading: LoadingStatus.idle,
        error: ""
    }),
    reducers: {
        guestLoading(state, action) {
            if(state.loading == LoadingStatus.idle) {
                state.loading = LoadingStatus.pending;
            }
        },
        guestAdded(state, action: PayloadAction<GuestType>) {
            guestsAdapter.addOne(state, action.payload);
        },
        guestReceived(state, action: PayloadAction<GuestType[]>) {
            guestsAdapter.setAll(state, action.payload);
            state.loading = LoadingStatus.idle;
        }
    }
})

export const { 
    guestLoading,
    guestReceived
} = guestSlice.actions;

export const guestSelector = guestsAdapter.getSelectors(); 

export default guestSlice.reducer