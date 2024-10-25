import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import {
  User,
  adminRegister,
  userRegister,
  userLogin,
} from "../../api/authenticationAPI";

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

export const loginUser = createAsyncThunk<User, User, { rejectValue: string }>(
  "login/user",
  async (user, { rejectWithValue }) => {
    try {
      const response = userLogin(user);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message) || "Error trying to login";
    }
  }
);


// create a slice to handle authentication/

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
      state.user = action.payload;
    })
    .addCase(loginUser.rejected, (state, action) =>{
      state.status = "failed";
      state.error = action.error.message || "Failed to login user";
    })    
  }
})

export default authSlice.reducer;