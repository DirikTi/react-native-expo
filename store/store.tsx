import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux';

import userReducer from './reducers/user/userSlice';
import guestReducer from './reducers/guest/guestSlice';

export const store = configureStore({ 
    reducer: {
        user: userReducer,
        guest: guestReducer
    } 
});

export const useAppDispatch = () => useDispatch<typeof store.dispatch>()
export type RootStateType = ReturnType<typeof store.getState>