import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { showErrorToast } from "../utils/showErrorToast";

const initialState = {
    restaurantLoading: false,
    restaurantError: null,
    restaurant: null,
    restaurantUpdateLoading: false,
    donations: [],
    ownedDonations: [],
    donationsLoading: true,
    ownedDonationsLoading: true,
}

export const updateRestaurant = createAsyncThunk(
    'restaurants/update-restaurant',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put('/restaurants/update-account', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const getRestaurantDetail = createAsyncThunk(
    'restaurants/get-restaurant-detail',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.get(`/restaurants/restaurant/${data.id}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
)

export const makeDonation = createAsyncThunk(
    'restaurants/make-donation',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/restaurants/make-donation', data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const getDonations = createAsyncThunk(
    'restaurants/get-donations',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.get('/restaurants/donations');
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const getOwnedDonations = createAsyncThunk(
    'restaurants/get-owned-donations',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.get('/restaurants/owned-donations');
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const deleteDonation = createAsyncThunk(
    'restaurants/delete-donation',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/restaurants/donation/${data.donationId}`);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const updateDonation = createAsyncThunk(
    'restaurants/update-donation',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put(`/restaurants/donation/${data.donationId}`, data);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const cancelOwnedDonation = createAsyncThunk(
    'restaurants/cancel-owned-donation',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put(`/restaurants/donations/cancel/${data.donationId}`);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)

export const updateDonationStatusToNextStep = createAsyncThunk(
    'restaurants/update-donation-status-to-next-step',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put(`/restaurants/donations/${data.donationId}`);
            return response.data;
        } catch (err) {
            showErrorToast(err.response.data.message);
            return rejectWithValue(err.response.data);
        }
    }
)


const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        updateRestaurantReducer: (state, { payload }) => {
            state.restaurant = payload;
        },
        donationsLoadingReducer: (state, { payload }) => {
            state.donationsLoading = payload;
        },
        ownedDonationsLoadingReducer: (state, { payload }) => {
            state.ownedDonationsLoading = payload;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(updateRestaurant.pending, (state) => {
                state.restaurantUpdateLoading = true;
            })
            .addCase(updateRestaurant.fulfilled, (state, { payload }) => {
                state.restaurantUpdateLoading = false;
                state.restaurant = payload.data;
            })
            .addCase(updateRestaurant.rejected, (state, { payload }) => {
                state.restaurantUpdateLoading = false;
                state.restaurantError = payload;
            })
            .addCase(getRestaurantDetail.pending, (state) => {
                state.restaurantLoading = true;
            })
            .addCase(getRestaurantDetail.fulfilled, (state, { payload }) => {
                state.restaurantLoading = false;
                state.restaurant = payload.data;
            })
            .addCase(getRestaurantDetail.rejected, (state, { payload }) => {
                state.restaurantLoading = false;
                state.restaurantError = payload;
            })
            .addCase(makeDonation.pending, (state) => {
                state.restaurantLoading = true;
            })
            .addCase(makeDonation.fulfilled, (state, { payload }) => {
                state.restaurantLoading = false;
                state.donations.push(payload.data);
            })
            .addCase(makeDonation.rejected, (state, { payload }) => {
                state.restaurantLoading = false;
                state.restaurantError = payload;
            })
            .addCase(getDonations.pending, (state) => {
                state.donationsLoading = true;
            })
            .addCase(getDonations.fulfilled, (state, { payload }) => {
                state.donationsLoading = false;
                state.donations = payload.data;
            })
            .addCase(getDonations.rejected, (state, { payload }) => {
                state.donationsLoading = false;
                state.restaurantError = payload;
            })
            .addCase(getOwnedDonations.pending, (state) => {
                state.ownedDonationsLoading = true;
            })
            .addCase(getOwnedDonations.fulfilled, (state, { payload }) => {
                state.ownedDonationsLoading = false;
                state.ownedDonations = payload.data;
            })
            .addCase(getOwnedDonations.rejected, (state, { payload }) => {
                state.ownedDonationsLoading = false;
                state.restaurantError = payload;
            })
            .addCase(deleteDonation.pending, (state) => {
                state.restaurantLoading = true;
            })
            .addCase(deleteDonation.fulfilled, (state, { payload }) => {
                state.restaurantLoading = false;
                state.donations = state.donations.filter(donation => donation.id !== payload.data.id);
            })
            .addCase(deleteDonation.rejected, (state, { payload }) => {
                state.restaurantLoading = false;
                state.restaurantError = payload;
            })
            .addCase(updateDonation.pending, (state) => {
                state.restaurantLoading = true;
            })
            .addCase(updateDonation.fulfilled, (state, { payload }) => {
                state.restaurantLoading = false;
                state.donations[state.donations.findIndex(donation => donation.id === payload.data.id)] = payload.data;
            })
            .addCase(updateDonation.rejected, (state, { payload }) => {
                state.restaurantLoading = false;
                state.restaurantError = payload;
            })
            .addCase(cancelOwnedDonation.pending, (state) => {
                state.restaurantLoading = true;
            })
            .addCase(cancelOwnedDonation.fulfilled, (state, { payload }) => {
                state.restaurantLoading = false;
                state.ownedDonations[state.ownedDonations.findIndex(donation => donation.id === payload.data.id)] = payload.data;
            })
            .addCase(cancelOwnedDonation.rejected, (state, { payload }) => {
                state.restaurantLoading = false;
                state.restaurantError = payload;
            })
            .addCase(updateDonationStatusToNextStep.pending, (state) => {
                state.restaurantLoading = true;
            })
            .addCase(updateDonationStatusToNextStep.fulfilled, (state, { payload }) => {
                state.restaurantLoading = false;
                state.ownedDonations[state.ownedDonations.findIndex(donation => donation.id === payload.data.id)] = payload.data;
            })
            .addCase(updateDonationStatusToNextStep.rejected, (state, { payload }) => {
                state.restaurantLoading = false;
                state.restaurantError = payload;
            })
})

export const { updateRestaurantReducer, ownedDonationsLoadingReducer, donationsLoadingReducer } = restaurantSlice.actions;

export default restaurantSlice.reducer;