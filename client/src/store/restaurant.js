import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { showErrorToast } from "../utils/showErrorToast";

const initialState = {
    restaurantLoading: false,
    restaurantError: null,
    restaurant: null,
    restaurantUpdateLoading: false,
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
        }
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
})

export const { updateRestaurantReducer } = restaurantSlice.actions;

export default restaurantSlice.reducer;