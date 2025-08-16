import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage if exists
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('cart');
        if (!serializedState) return null;
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Failed to load cart from localStorage', err);
        return null;
    }
};

const initialState = loadState() || {
    items: [],
    customerInfo: {
        fullName: "",
        phone: "",
        email: "",
        address: {
            street: "",
            area: "",
            governorate: "",
            block: "",
            building: "",
            floor: "",
            apartment: ""
        }
    }
};

// Helper to save state to localStorage
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('cart', serializedState);
    } catch (err) {
        console.error('Failed to save cart to localStorage', err);
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.items.find(item => item.productId === product.id);

            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.total = existingItem.quantity * existingItem.unitPrice;
            } else {
                state.items.push({
                    productId: product.id,
                    productName: product.name,
                    description: product.description || "",
                    unitPrice: product.price,
                    quantity,
                    total: product.price * quantity,
                    image: product.images?.[0].url || "" 
                });
            }
            saveState(state);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.productId !== action.payload);
            saveState(state);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(item => item.productId === productId);
            if (item) {
                item.quantity = quantity;
                item.total = item.unitPrice * quantity;
            }
            saveState(state);
        },
        clearCart: (state) => {
            state.items = [];
            state.customerInfo = initialState.customerInfo;
            saveState(state);
        },
        setCustomerInfo: (state, action) => {
            state.customerInfo = { ...state.customerInfo, ...action.payload };
            saveState(state);
        },
        setCartItems: (state, action) => {
            state.items = action.payload.map(item => ({
                productId: item.productId,
                productName: item.productName,
                description: item.description || "",
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                total: item.total,
                image: product.images?.[0].url || "" 
            }));
            saveState(state);
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCustomerInfo, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
