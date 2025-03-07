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

// Check if user has rated a product
export const checkUserRating = createAsyncThunk(
    'rating/checkUserRating',
    async ({ userId, productId }, { rejectWithValue }) => {
        try {
            const response = await API.get(`rating/has-rated/${userId}/${productId}`);
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
    hasRated: false, // New state to track if the user has rated the product
    userRating: null, // New state to store the user's rating details
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
        resetUserRating(state) {
            state.hasRated = false;
            state.userRating = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Ratings
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

            // Add or Update Rating
            .addCase(addOrUpdateRating.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addOrUpdateRating.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = action.payload.message || 'Rating added/updated successfully';
                state.error = null;
                state.hasRated = true; // Update hasRated state
                state.userRating = action.payload.rating; // Update userRating state
            })
            .addCase(addOrUpdateRating.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to add/update rating';
            })

            // Delete Rating
            .addCase(deleteRating.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteRating.fulfilled, (state) => {
                state.isLoading = false;
                state.success = 'Rating deleted successfully';
                state.error = null;
                state.hasRated = false; // Reset hasRated state
                state.userRating = null; // Reset userRating state
            })
            .addCase(deleteRating.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to delete rating';
            })

            // Check User Rating
            .addCase(checkUserRating.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkUserRating.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasRated = action.payload.hasRated;
                state.userRating = action.payload.rating || null;
                state.error = null;
            })
            .addCase(checkUserRating.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to check user rating';
            });
    },
});

export const { clearSuccess, clearError, resetUserRating } = ratingSlice.actions;

export default ratingSlice.reducer;