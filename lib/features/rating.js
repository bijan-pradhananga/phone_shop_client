import API from "@/config/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Fetch ratings for a product
export const fetchRatings = createAsyncThunk(
    'rating/fetchRatings',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await API.get(`rating/${productId}`);
            return response.data;
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

// Add or update rating
export const addOrUpdateRating = createAsyncThunk(
    "rating/addOrUpdateRating",
    async ({ userId, productId, rating, review }, { rejectWithValue }) => {
        try {
            const response = await API.post("/rating", { userId, productId, rating, review });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to submit rating");
        }
    }
);

// Delete rating
export const deleteRating = createAsyncThunk(
    'rating/deleteRating',
    async ({ userId, productId }, { rejectWithValue }) => {
        try {
            const response = await API.delete(`rating/${userId}/${productId}`);
            return response.data;
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

// Error handling function
const handleError = (error, rejectWithValue) => {
    if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'An error occurred');
    }
    return rejectWithValue('An error occurred while processing the request');
};

const initialState = {
    ratings: [],
    isLoading: true,
    success: false,
    error: null,
};

const ratingSlice = createSlice({
    name: 'rating',
    initialState,
    reducers: {
        clearSuccess(state) {
            state.success = false;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRatings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchRatings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ratings = action.payload.ratings;
                state.error = null;
            })
            .addCase(fetchRatings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to fetch ratings';
            })
            .addCase(addOrUpdateRating.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addOrUpdateRating.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = action.payload.message || 'Rating added/updated successfully';
                state.error = null;
            })
            .addCase(addOrUpdateRating.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to add/update rating';
            })
            .addCase(deleteRating.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteRating.fulfilled, (state) => {
                state.isLoading = false;
                state.success = 'Rating deleted successfully';
                state.error = null;
            })
            .addCase(deleteRating.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to delete rating';
            });
    },
});

export const { clearSuccess, clearError } = ratingSlice.actions;

export default ratingSlice.reducer;
