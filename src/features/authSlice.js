import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

// Async thunk for employee login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://api.rightships.com/employee/login', credentials);
      const { _id, name, profile_photo, mobile_no, email, presentRank } = response.data.employee;
      const user = { _id, name, profile_photo, mobile_no, email, role: "employee" };
      return { user, token: response.data.token };
    } catch (error) {
      const message = error.response?.data?.message || 'An unexpected error occurred';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for company login
export const loginCompany = createAsyncThunk(
  'auth/login/company',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://api.rightships.com/company/login', credentials);
      const { _id, company_id, mobile_no } = response.data.data;
      const user = { _id, company_id, mobile_no, role: "company" };
      return { user, token: response.data.token };
    } catch (error) {
      const message = error.response?.data?.message || 'An unexpected error occurred';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async () => {
  // Clear local storage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  // Return a fulfilled action to trigger the logout reducer
  return true;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        // Store user and token in localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        // Store user and token in localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
