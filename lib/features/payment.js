import API from "@/config/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Fetch payment statistics
export const fetchPaymentStats = createAsyncThunk(
    'payment/fetchPaymentStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('payment/stats');
            return response.data;
        } catch (error) {
            return handleError(error, rejectWithValue);
        }
    }
);

// Fetch payments by date
export const fetchPaymentsByDate = createAsyncThunk(
    'payment/fetchPaymentsByDate',
    async ({ groupBy = 'month' }, { rejectWithValue }) => {
        try {
            const response = await API.get(`payment/by-date?groupBy=${groupBy}`);
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
    chartData: null,
    dateChartData: null,
    isLoading: true,
    success: false,
    error: null,
};

const paymentSlice = createSlice({
    name: 'payment',
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
            .addCase(fetchPaymentStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPaymentStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.chartData = action.payload.chartData;
                state.success = action.payload.message || 'Payment stats fetched successfully';
                state.error = null;
            })
            .addCase(fetchPaymentStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to fetch payment stats';
            })
            .addCase(fetchPaymentsByDate.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPaymentsByDate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dateChartData = action.payload.chartData;
                state.success = action.payload.message || 'Payments by date fetched successfully';
                state.error = null;
            })
            .addCase(fetchPaymentsByDate.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to fetch payments by date';
            });
    },
});

export const { clearSuccess, clearError } = paymentSlice.actions;

export default paymentSlice.reducer;