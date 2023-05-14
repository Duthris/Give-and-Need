import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { showErrorToast } from "../utils/showErrorToast";

const initialState = {
    giverLoading: false,
    giverError: null,
    gives: [],
    ownedGives: [],
    givesLoading: true,
    ownedGivesLoading: true,
    forgotLoading: false,
    changeLoading: false,
    verifyLoading: false,
    resendLoading: false,
}

export const verifyGiver = createAsyncThunk(
    'giver/verify-giver',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put('/givers/auth/verify', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const forgotPasswordGiver = createAsyncThunk(
    'giver/forgot-password',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/givers/auth/forgot-password', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const changePasswordGiver = createAsyncThunk(
    'giver/change-password',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put('/givers/auth/change-password', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const reSendVerificationCode = createAsyncThunk(
    'giver/resend-verification-code',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/givers/auth/resend-verification-code', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const getGives = createAsyncThunk(
    'giver/my-gives',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.get('/givers/my-donations/');
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const getOwnedGives = createAsyncThunk(
    'giver/my-owned-gives',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.get('/givers/owned-donations/');
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const updatGiveStatusToNextStep = createAsyncThunk(
    'giver/update-give-status-to-next-step',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put(`/givers/owned-donations/${data.donationId}`);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const updateGive = createAsyncThunk(
    'giver/update-give',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put(`/givers/my-donations/${data.packagedFoodId}`, data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            console.log(err.response.data.message, 'asd');
            return rejectWithValue(err.response.data);
        }
    }
)

export const cancelGive = createAsyncThunk(
    'giver/cancel-give',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put(`/givers/owned-donations/cancel/${data.donationId}`);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            console.log(err.response.data.message, 'asd');
            return rejectWithValue(err.response.data);
        }
    }
)

export const makeDonation = createAsyncThunk(
    'giver/make-donation',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/givers/make-donation/', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const deleteDonation = createAsyncThunk(
    'giver/delete-donation',
    async (data, { rejectWithValue }) => {
        try {
            console.log(`/givers/my-donations/${data.packagedFoodId}`);
            const response = await api.remove(`/givers/my-donations/${data.packagedFoodId}`);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

const giverSlice = createSlice({
    name: 'giver',
    initialState,
    reducers: {
        clearGiverError: (state) => {
            state.giverError = null;
        },
        givesLoading: (state, { payload }) => {
            state.givesLoading = payload;
        },
        ownedGivesLoading: (state, { payload }) => {
            state.ownedGivesLoading = payload;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(verifyGiver.pending, (state) => {
                state.verifyLoading = true;
                state.giverError = null;
            })
            .addCase(verifyGiver.fulfilled, (state) => {
                state.verifyLoading = false;
            })
            .addCase(verifyGiver.rejected, (state, { payload }) => {
                state.verifyLoading = false;
                state.giverError = payload;
            })
            .addCase(forgotPasswordGiver.pending, (state) => {
                state.forgotLoading = true;
                state.giverError = null;
            })
            .addCase(forgotPasswordGiver.fulfilled, (state) => {
                state.forgotLoading = false;
            })
            .addCase(forgotPasswordGiver.rejected, (state, { payload }) => {
                state.forgotLoading = false;
                state.giverError = payload;
            })
            .addCase(changePasswordGiver.pending, (state) => {
                state.changeLoading = true;
                state.giverError = null;
            })
            .addCase(changePasswordGiver.fulfilled, (state) => {
                state.changeLoading = false;
            })
            .addCase(changePasswordGiver.rejected, (state, { payload }) => {
                state.changeLoading = false;
                state.giverError = payload;
            })
            .addCase(reSendVerificationCode.pending, (state) => {
                state.reSendLoading = true;
                state.giverError = null;
            })
            .addCase(reSendVerificationCode.fulfilled, (state) => {
                state.reSendLoading = false;
            })
            .addCase(reSendVerificationCode.rejected, (state, { payload }) => {
                state.reSendLoading = false;
                state.giverError = payload;
            })
            .addCase(getGives.pending, (state) => {
                state.givesLoading = true;
                state.giverError = null;
            })
            .addCase(getGives.fulfilled, (state, { payload }) => {
                state.givesLoading = false;
                state.gives = payload.data;
            })
            .addCase(getGives.rejected, (state, { payload }) => {
                state.givesLoading = false;
                state.giverError = payload;
            })
            .addCase(getOwnedGives.pending, (state) => {
                state.ownedGivesLoading = true;
                state.giverError = null;
            })
            .addCase(getOwnedGives.fulfilled, (state, { payload }) => {
                state.ownedGivesLoading = false;
                state.ownedGives = payload.data;
            })
            .addCase(getOwnedGives.rejected, (state, { payload }) => {
                state.ownedGivesLoading = false;
                state.giverError = payload;
            })
            .addCase(updatGiveStatusToNextStep.pending, (state) => {
                state.giverLoading = true;
                state.giverError = null;
            })
            .addCase(updatGiveStatusToNextStep.fulfilled, (state, { payload }) => {
                state.giverLoading = false;
                state.ownedGives[state.ownedGives.findIndex(give => give.id === payload.data.id)] = payload.data;
            })
            .addCase(updatGiveStatusToNextStep.rejected, (state, { payload }) => {
                state.giverLoading = false;
                state.giverError = payload;
            })
            .addCase(updateGive.pending, (state) => {
                state.giverLoading = true;
                state.giverError = null;
            })
            .addCase(updateGive.fulfilled, (state, { payload }) => {
                state.giverLoading = false;
                state.gives[state.gives.findIndex(give => give.id === payload.data.id)] = payload.data;
            })
            .addCase(updateGive.rejected, (state, { payload }) => {
                state.giverLoading = false;
                state.giverError = payload;
            })
            .addCase(cancelGive.pending, (state) => {
                state.giverLoading = true;
                state.giverError = null;
            })
            .addCase(cancelGive.fulfilled, (state, { payload }) => {
                state.giverLoading = false;
                state.ownedGives[state.ownedGives.findIndex(give => give.id === payload.data.id)] = payload.data;
            })
            .addCase(cancelGive.rejected, (state, { payload }) => {
                state.giverLoading = false;
                state.giverError = payload;
            })
            .addCase(makeDonation.pending, (state) => {
                state.giverLoading = true;
                state.giverError = null;
            })
            .addCase(makeDonation.fulfilled, (state, { payload }) => {
                state.giverLoading = false;
                state.gives.push(payload.data);
            })
            .addCase(makeDonation.rejected, (state, { payload }) => {
                state.giverLoading = false;
                state.giverError = payload;
            })
            .addCase(deleteDonation.pending, (state) => {
                state.giverLoading = true;
                state.giverError = null;
            })
            .addCase(deleteDonation.fulfilled, (state, { payload }) => {
                state.giverLoading = false;
                state.gives = state.gives.filter(give => give.id !== payload.data.id);
            })
            .addCase(deleteDonation.rejected, (state, { payload }) => {
                state.giverLoading = false;
                state.giverError = payload;
            })
})

export const { clearGiverError, givesLoading, ownedGivesLoading } = giverSlice.actions;

export default giverSlice.reducer;