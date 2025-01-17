import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import {
  User,
  adminRegister,
  userRegister,
  userLogin,
} from "../../utils/api/authenticationAPI";

// create different Thunks to consume the Data from endpoints
export const registerAdmin = createAsyncThunk<
  User,
  User,
  { rejectValue: string }
>("register/admin", async (user, { rejectWithValue }) => {
  // register the user and wait till the response is received
  try {
    const response = adminRegister(user);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message) || "Error registering admin";
  }
});

export const registerUser = createAsyncThunk<
  User,
  User,
  { rejectValue: string }
>("register/user", async (user, { rejectWithValue }) => {
  try {
    // register user with view priviledge
    const response = userRegister(user);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message) || "Error registering User";
  }
});

export const loginUser = createAsyncThunk<{access: string, refresh: string}, User, { rejectValue: string }>(
  "login/user",
  async (user, { rejectWithValue }) => {
    try {
      const response = await userLogin(user);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message) || "Error trying to login";
    }
  }
);

export const logoutUser = createAsyncThunk(
  "logout/user",
  async () => {
    return null;
  }
);// create a slice to handle authentication/

// create type for the slice
interface authState {
  user:User;
  status: "idle" | "loading" | "succeed" | "failed";
  error:string | null;
};

const initialState: authState = {
  user: {
    username: "",
    contact: "",
    email: "",
    password: "",
    access: "",
    refresh: "",
  },
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name:"authentication",
  initialState,
  reducers:{},
  extraReducers:(builder) =>{
    builder

    // register admin user
    .addCase(registerAdmin.pending, (state)=>{
      state.status = "loading";
    })
    .addCase(registerAdmin.fulfilled, (state, action) =>{
      state.status = "succeed";
      state.user = action.payload;
    })
    .addCase(registerAdmin.rejected, (state, action) =>{
      state.status = "failed";
      state.error = action.error.message || "Failed to register admin";
    })

    // register user
    .addCase(registerUser.pending, (state) =>{
      state.status = "loading";
    })
    .addCase(registerUser.fulfilled, (state, action) =>{
      state.status = "succeed";
      state.user = action.payload;
    })
    .addCase(registerUser.rejected, (state, action) =>{
      state.status = "failed";
      state.error = action.error.message || "Failed to register user";
    })

    // login user
    .addCase(loginUser.pending, (state) =>{
      state.status = "loading";
    })
    .addCase(loginUser.fulfilled, (state, action) =>{
      state.status = "succeed";
      state.user.access = action.payload.access;
      state.user.refresh = action.payload.refresh;

    })
    .addCase(loginUser.rejected, (state, action) =>{
      state.status = "failed";
      state.error = action.error.message || "Failed to login user";
    })

    // logout user
    .addCase(logoutUser.pending, (state) =>{
      state.status = "loading";
    })
    .addCase(logoutUser.fulfilled, (state) =>{
      state.status = "succeed";
      state.user = {
        username: "",
        contact: "",
        email: "",
        password: "",
        access: "",
        refresh: "",
      };
    })
    .addCase(logoutUser.rejected, (state, action) =>{
      state.status = "failed";
      state.error = action.error.message || "Failed to logout user";
    })
  }
})

export default authSlice.reducer;