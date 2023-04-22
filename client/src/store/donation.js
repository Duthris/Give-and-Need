import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { showErrorToast } from "../utils/showErrorToast";

const initialState = {
    donationLoading: false,
    donationError: null,
    packagedFoods: [],
    restaurantFoods: [],
}

export const getPackagedFoods = createAsyncThunk(
    'donations/packagedFoods',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.get('/donations/packaged-foods');
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const getRestaurantFoods = createAsyncThunk(
    'donations/restaurant-foods',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.get('/donations/open-foods');
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

const donationSlice = createSlice({
    name: 'donation',
    initialState,
    reducers: {
        clearDonationError: (state) => {
            state.donationError = null;
        }
    },
    extraReducers: (builder) =>
        builder
            .addCase(getPackagedFoods.pending, (state) => {
                state.donationLoading = true;
            })
            .addCase(getPackagedFoods.fulfilled, (state, { payload }) => {
                state.donationLoading = false;
                state.packagedFoods = payload.data;
            })
            .addCase(getPackagedFoods.rejected, (state, action) => {
                if (action.payload) state.donationError = action.payload.error;
                else state.donationError = action.error.message;
                state.donationLoading = false;
            })
            .addCase(getRestaurantFoods.pending, (state) => {
                state.donationLoading = true;
            })
            .addCase(getRestaurantFoods.fulfilled, (state, { payload }) => {
                state.donationLoading = false;
                state.restaurantFoods = payload.data;
            })
            .addCase(getRestaurantFoods.rejected, (state, action) => {
                if (action.payload) state.donationError = action.payload.error;
                else state.donationError = action.error.message;
                state.donationLoading = false;
            })

})

export const { clearDonationError } = donationSlice.actions;

export default donationSlice.reducer;