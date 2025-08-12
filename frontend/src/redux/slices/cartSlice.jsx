
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    customerInfo: null
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.items.find(item => item.productId === product._id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                    quantity
                });
            }
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.productId !== action.payload);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(item => item.productId === productId);
            if (item) {
                item.quantity = quantity;
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.customerInfo = null;
        },
        setCustomerInfo: (state, action) => {
            state.customerInfo = action.payload;
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCustomerInfo } = cartSlice.actions;
export default cartSlice.reducer;