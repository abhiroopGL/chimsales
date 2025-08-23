import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  loadingText: 'Loading...',
  loadingRequests: 0
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state, action) => {
      state.loadingRequests += 1;
      state.isLoading = true;
      state.loadingText = action.payload || 'Loading...';
    },
    stopLoading: (state) => {
      state.loadingRequests = Math.max(0, state.loadingRequests - 1);
      if (state.loadingRequests === 0) {
        state.isLoading = false;
        state.loadingText = 'Loading...';
      }
    },
    resetLoading: (state) => {
      state.isLoading = false;
      state.loadingText = 'Loading...';
      state.loadingRequests = 0;
    }
  }
});

export const { startLoading, stopLoading, resetLoading } = loadingSlice.actions;

// Initialize loading event listeners
export const initializeLoadingListeners = (store) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('loading:start', (event) => {
      store.dispatch(startLoading(event.detail?.text || 'Loading...'));
    });

    window.addEventListener('loading:stop', () => {
      store.dispatch(stopLoading());
    });
  }
};

export default loadingSlice.reducer;
