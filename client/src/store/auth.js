import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { showErrorToast } from "../utils/showErrorToast";

const initialState = {
    authLoading: false,
    authError: null,
    token: null,
    user: null,
}

export const neederLogin = createAsyncThunk(
    'needer/login',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/needers/auth/login', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const giverLogin = createAsyncThunk(
    'giver/login',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/givers/auth/login', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const restaurantLogin = createAsyncThunk(
    'restaurant/login',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/restaurants/auth/login', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const neederRegister = createAsyncThunk(
    'needer/register',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/needers/auth/register', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const giverRegister = createAsyncThunk(
    'giver/register',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/givers/auth/register', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data);
            return rejectWithValue(err.response.data);
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.user = null;
        },
        clearAuthError: (state) => {
            state.authError = null;
        }
    },
    extraReducers: (builder) => 
    builder
        .addCase(neederLogin.fulfilled, (state, { payload }) => {
            if (payload.data.token) {
                state.user = payload.data;
                state.token = payload.data.token;
                state.authError = null;
                state.authLoading = false;
            }
        })
        .addCase(neederLogin.rejected, (state, action) => {
            if (action.payload) state.error = action.payload.error;
            else state.authError = action.error.message;
            state.authLoading = false;
        })
        .addCase(neederLogin.pending, (state) => {
            state.authLoading = true;
        })
        .addCase(giverLogin.fulfilled, (state, { payload }) => {
            if (payload.data.token) {
                state.user = payload.data;
                state.token = payload.data.token;
                state.authError = null;
                state.authLoading = false;
            }
        })
        .addCase(giverLogin.rejected, (state, action) => {
            if (action.payload) state.error = action.payload.error;
            else state.authError = action.error.message;
            state.authLoading = false;
        })
        .addCase(giverLogin.pending, (state) => {
            state.authLoading = true;
        })
        .addCase(restaurantLogin.fulfilled, (state, { payload }) => {
            if (payload.data.token) {
                state.user = payload.data;
                state.token = payload.data.token;
                state.authError = null;
                state.authLoading = false;
            }
        })
        .addCase(restaurantLogin.rejected, (state, action) => {
            if (action.payload) state.error = action.payload.error;
            else state.authError = action.error.message;
            state.authLoading = false;
        })
        .addCase(restaurantLogin.pending, (state) => {
            state.authLoading = true;
        })
        .addCase(neederRegister.fulfilled, (state, { payload }) => {
            if (payload.data.token) {
                state.authError = null;
                state.authLoading = false;
            }
        })
        .addCase(neederRegister.rejected, (state, action) => {
            if (action.payload) state.error = action.payload.error;
            else state.authError = action.error.message;
            state.authLoading = false;
        })
        .addCase(neederRegister.pending, (state) => {
            state.authLoading = true;
        })
        .addCase(giverRegister.fulfilled, (state, { payload }) => {
            if (payload.data.token) {
                state.authError = null;
                state.authLoading = false;
            }
        })
        .addCase(giverRegister.rejected, (state, action) => {
            if (action.payload) state.error = action.payload.error;
            else state.authError = action.error.message;
            state.authLoading = false;
        })
        .addCase(giverRegister.pending, (state) => {
            state.authLoading = true;
        })
})

export const { logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;