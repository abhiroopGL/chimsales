// src/redux/slices/orderSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import { showNotification } from "../../redux/slices/notificationSlice"
import orderService from "../../services/orderService"



// Async thunk to fetch order
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrder',
  async (orderId, { rejectWithValue, dispatch }) => {
    try {
      const response = await orderService.getOrder(orderId)
      return response.data.order
    } catch (error) {
    //   dispatch(showNotification({
    //     type: "error",
    //     message: "Failed to fetch order details",
    //   }))
        console.error("Fetch order error:", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ orderId, formData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await orderService.updateOrder(orderId, formData)
      return response.data
    } catch (error) {
      console.error(error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const orderSlice = createSlice({
  name: "order",
  initialState: {
    isSaving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateOrder.pending, (state) => {
        state.isSaving = true
        state.error = null
      })
      .addCase(updateOrder.fulfilled, (state) => {
        state.isSaving = false
        state.error = null
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isSaving = false
        state.error = action.payload || "Failed to update order"
      })
  },
})

export default orderSlice.reducer
