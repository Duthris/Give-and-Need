import { configureStore } from '@reduxjs/toolkit';
import modal from "./modal";
import auth from "./auth";

const store = configureStore({
    reducer: {
        modal,
        auth,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
    }),
});

export default store;