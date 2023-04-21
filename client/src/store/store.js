import { configureStore } from '@reduxjs/toolkit';
import modal from "./modal";
import auth from "./auth";
import needer from "./needer";
import donation from './donation';

const store = configureStore({
    reducer: {
        modal,
        auth,
        needer,
        donation
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
    }),
});

export default store;