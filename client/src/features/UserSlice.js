import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
 

export const getUser = createAsyncThunk(
  "users/getUser",
  async (udata, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/login", udata);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Login failed. Please try again.");
    }
  }
);
 

export const addUser = createAsyncThunk(
  "users/addUser",
  async (udata, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/register", udata);
  
      return { ok: true };
    } catch (error) {
 
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Registration failed. Please try again.");
    }
  }
);
 
// Fetch user profile by email (server returns full user document)
export const getProfile = createAsyncThunk(
  "users/getProfile",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/profile", { email });
      return response.data; // server returns user object
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Failed to load profile.");
    }
  }
);

// Update user profile fields (name, city, bloodType, dob, etc.)
export const updateProfile = createAsyncThunk(
  "users/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/updateProfile", payload);
      return response.data; // { message: "Profile updated" }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Failed to update profile.");
    }
  }
);

const initialState = {
  user: null,
  message: "",
  isLoading: false,
  isSuccess: false,
  isError: false,
};
 
export const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isSuccess = false;
      state.isError = false;
      state.isLoading = false;
      state.message = "";
      try {
        localStorage.removeItem('userEmail');
      } catch {}
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Registration successful!";
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        // Do not echo server message; keep client-controlled text
        state.message = "";
      })
 
     
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.user = action.payload.user;
        try {
          if (action.payload?.user?.email) {
            localStorage.setItem('userEmail', action.payload.user.email);
          }
        } catch {}
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Login failed.";
      });

    // Load profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // response is user object
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to load profile.";
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Keep existing user; caller should refresh via getProfile
        state.message = "Profile updated";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to update profile.";
      });
  },
});
 
export const { logout } = UserSlice.actions;
export default UserSlice.reducer;
 