import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { showErrorToast } from "../utils/showErrorToast";

const initialState = {
    neederLoading: false,
    neederError: null,
    needs: [],
    needer: null,
    needsLoading: true,
    forgotLoading: false,
    changeLoading: false,
    verifyLoading: false,
    resendLoading: false,
    updateLoading: false,
}

export const verifyNeeder = createAsyncThunk(
    'needer/verify-needer',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put('/needers/auth/verify', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const forgotPasswordNeeder = createAsyncThunk(
    'needer/forgot-password',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/needers/auth/forgot-password', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const changePasswordNeeder = createAsyncThunk(
    'needer/change-password',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put('/needers/auth/change-password', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const reSendVerificationCode = createAsyncThunk(
    'needer/resend-verification-code',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/needers/auth/resend-verification-code', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const getNeederDetail = createAsyncThunk(
    'needer/detail',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.get(`/needers/needer/${data.id}`);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const getNeeds = createAsyncThunk(
    'needer/needs',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.get('/needers/my-needs');
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const markNeedAsCompleted = createAsyncThunk(
    'needer/markNeedAsCompleted',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put(`/needers/mark-as-completed-need/${data.id}`);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const needFood = createAsyncThunk(
    'needer/need-food',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/needers/need-food', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const updateNeeder = createAsyncThunk(
    'needer/update-needer',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put('/needers/update-account', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

const neederSlice = createSlice({
    name: 'needer',
    initialState,
    reducers: {
        clearNeedererror: (state) => {
            state.neederError = null;
        },
        needsLoading: (state, { payload }) => {
            state.needsLoading = payload;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(verifyNeeder.pending, (state) => {
                state.verifyLoading = true;
                state.neederError = null;
            })
            .addCase(verifyNeeder.fulfilled, (state) => {
                state.verifyLoading = false;
            })
            .addCase(verifyNeeder.rejected, (state, { payload }) => {
                state.verifyLoading = false;
                state.neederError = payload;
            })
            .addCase(forgotPasswordNeeder.pending, (state) => {
                state.forgotLoading = true;
                state.neederError = null;
            })
            .addCase(forgotPasswordNeeder.fulfilled, (state) => {
                state.forgotLoading = false;
            })
            .addCase(forgotPasswordNeeder.rejected, (state, { payload }) => {
                state.forgotLoading = false;
                state.neederError = payload;
            })
            .addCase(changePasswordNeeder.pending, (state) => {
                state.changeLoading = true;
                state.neederError = null;
            })
            .addCase(changePasswordNeeder.fulfilled, (state) => {
                state.changeLoading = false;
            })
            .addCase(changePasswordNeeder.rejected, (state, { payload }) => {
                state.changeLoading = false;
                state.neederError = payload;
            })
            .addCase(reSendVerificationCode.pending, (state) => {
                state.resendLoading = true;
                state.neederError = null;
            })
            .addCase(reSendVerificationCode.fulfilled, (state) => {
                state.resendLoading = false;
            })
            .addCase(reSendVerificationCode.rejected, (state, { payload }) => {
                state.resendLoading = false;
                state.neederError = payload;
            })
            .addCase(getNeederDetail.pending, (state) => {
                state.neederLoading = true;
            })
            .addCase(getNeederDetail.fulfilled, (state, { payload }) => {
                state.neederLoading = false;
                state.needer = payload.data;
            })
            .addCase(getNeederDetail.rejected, (state, action) => {
                if (action.payload) state.neederError = action.payload.error;
                else state.neederError = action.error.message;
                state.neederLoading = false;
            })
            .addCase(getNeeds.pending, (state) => {
                state.needsLoading = true;
            })
            .addCase(getNeeds.fulfilled, (state, { payload }) => {
                state.needsLoading = false;
                state.needs = payload.data;
            })
            .addCase(getNeeds.rejected, (state, action) => {
                if (action.payload) state.neederError = action.payload.error;
                else state.neederError = action.error.message;
                state.needsLoading = false;
            })
            .addCase(markNeedAsCompleted.pending, (state) => {
                state.neederLoading = true;
            })
            .addCase(markNeedAsCompleted.fulfilled, (state, { payload }) => {
                const currentNeeds = [...state.needs];
                const needIndex = state.needs.findIndex(need => need.id === payload.data.id);
                currentNeeds[needIndex] = payload.data;
                state.needs = currentNeeds;
                state.neederLoading = false;
            })
            .addCase(markNeedAsCompleted.rejected, (state, action) => {
                if (action.payload) state.neederError = action.payload.error;
                else state.neederError = action.error.message;
                state.neederLoading = false;
            })
            .addCase(needFood.pending, (state) => {
                state.neederLoading = true;
            })
            .addCase(needFood.fulfilled, (state, { payload }) => {
                state.neederLoading = false;
            })
            .addCase(needFood.rejected, (state, action) => {
                if (action.payload) state.neederError = action.payload.error;
                else state.neederError = action.error.message;
                state.neederLoading = false;
            })
            .addCase(updateNeeder.pending, (state) => {
                state.updateLoading = true;
            })
            .addCase(updateNeeder.fulfilled, (state, { payload }) => {
                state.updateLoading = false;
                state.needer = payload.data;
            })
            .addCase(updateNeeder.rejected, (state, action) => {
                if (action.payload) state.neederError = action.payload.error;
                else state.neederError = action.error.message;
                state.updateLoading = false;
            })
})

export const { clearNeedererror, needsLoading } = neederSlice.actions;

export default neederSlice.reducer;