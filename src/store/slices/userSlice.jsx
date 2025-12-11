import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch user
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return { success: false };

      const {data} = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

  
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    user: null,
    loading: true,
  },
  reducers: {
    setUser(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload; // user object
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success) {
          state.isLoggedIn = true;
          state.user = action.payload.data.user;
        } else {
          state.isLoggedIn = false;
          state.user = null;
        }
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export const {setUser, logout } = userSlice.actions;

export default userSlice.reducer;
