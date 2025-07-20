import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import invoiceService from "../../services/invoiceService";

// Initial State
const initialState = {
  invoices: [],
  currentInvoice: null,
  isLoading: false,
  error: null,
  stats: {
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
  },
  totalPages: 1,
  currentPage: 1,
};

// Thunks
export const fetchInvoices = createAsyncThunk("invoices/fetchAll", async (filters = {}, { rejectWithValue }) => {
  try {
    const response = await invoiceService.getInvoices();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch invoices");
  }
});

export const fetchInvoiceById = createAsyncThunk("invoices/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await invoiceService.getInvoice(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch invoice");
  }
});

export const createInvoice = createAsyncThunk("invoices/create", async (invoiceData, { rejectWithValue }) => {
  try {
    const response = await invoiceService.createInvoice(invoiceData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create invoice");
  }
});

export const updateInvoice = createAsyncThunk("invoices/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await invoiceService.updateInvoice(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update invoice");
  }
});

export const deleteInvoice = createAsyncThunk("invoices/delete", async (id, { rejectWithValue }) => {
  try {
    await invoiceService.deleteInvoice(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete invoice");
  }
});

export const sendInvoice = createAsyncThunk("invoices/send", async (id, { rejectWithValue }) => {
  try {
    const response = await invoiceService.sendInvoice(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to send invoice");
  }
});

// Slice
const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateInvoiceStatus: (state, action) => {
      const { id, status } = action.payload;
      const invoice = state.invoices.find((inv) => inv._id === id);
      if (invoice) {
        invoice.status = status;
        invoice.updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices = action.payload.invoices;
        state.totalPages = action.payload.pagination?.totalPages || 1;
        state.currentPage = action.payload.pagination?.currentPage || 1;
        state.stats = action.payload.stats || state.stats;
        state.isLoading = false;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch single invoice
      .addCase(fetchInvoiceById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.currentInvoice = action.payload.invoice;
        state.isLoading = false;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create invoice
      .addCase(createInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload.invoice);
        state.isLoading = false;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update invoice
      .addCase(updateInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        const updated = action.payload.invoice;
        const index = state.invoices.findIndex((inv) => inv._id === updated._id);
        if (index !== -1) state.invoices[index] = updated;
        if (state.currentInvoice?._id === updated._id) state.currentInvoice = updated;
        state.isLoading = false;
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter((inv) => inv._id !== action.payload);
        if (state.currentInvoice?._id === action.payload) state.currentInvoice = null;
        state.isLoading = false;
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Send invoice
      .addCase(sendInvoice.fulfilled, (state, action) => {
        const updated = action.payload.invoice;
        const index = state.invoices.findIndex((inv) => inv._id === updated._id);
        if (index !== -1) {
          state.invoices[index] = {
            ...state.invoices[index],
            sentAt: updated.sentAt,
            status: updated.status,
          };
        }
        if (state.currentInvoice?._id === updated._id) {
          state.currentInvoice = updated;
        }
      });
  },
});

// Export Actions
export const { clearCurrentInvoice, clearError, updateInvoiceStatus } = invoiceSlice.actions;

// Export Reducer
export default invoiceSlice.reducer;
