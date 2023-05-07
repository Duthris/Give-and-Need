import { configureStore } from '@reduxjs/toolkit';
import modal from "./modal";
import auth from "./auth";
import needer from "./needer";
import donation from './donation';
import giver from './giver';

const store = configureStore({
    reducer: {
        modal,
        auth,
        needer,
        donation,
        giver
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
    }),
});

export default store;