import { configureStore } from '@reduxjs/toolkit';
import brandReducer from './features/brand';
import cartReducer from './features/cart';
import productReducer from './features/product';
import paymentReducer from './features/payment';
import orderReducer from './features/order';
import ratingReducer from './features/rating'

export const makeStore = () => {
  return configureStore({
    reducer: {
      brand: brandReducer,
      cart:cartReducer,
      order: orderReducer,
      product: productReducer,
      rating: ratingReducer,
      payment: paymentReducer,
    },
  })
}