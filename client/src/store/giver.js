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
}

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
})

export const { clearGiverError, givesLoading, ownedGivesLoading } = giverSlice.actions;

export default giverSlice.reducer;