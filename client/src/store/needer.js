import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { showErrorToast } from "../utils/showErrorToast";

const initialState = {
    neederLoading: false,
    neederError: null,
    needs: [],
}

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

const neederSlice = createSlice({
    name: 'needer',
    initialState,
    reducers: {
        clearNeedererror: (state) => {
            state.neederError = null;
        }
    },
    extraReducers: (builder) =>
        builder
            .addCase(getNeeds.pending, (state) => {
                state.neederLoading = true;
            })
            .addCase(getNeeds.fulfilled, (state, { payload }) => {
                state.neederLoading = false;
                state.needs = payload.data;
            })
            .addCase(getNeeds.rejected, (state, action) => {
                if (action.payload) state.neederError = action.payload.error;
                else state.neederError = action.error.message;
                state.neederLoading = false;
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
})

export const { clearNeedererror } = neederSlice.actions;

export default neederSlice.reducer;