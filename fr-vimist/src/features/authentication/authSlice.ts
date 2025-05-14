import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  User,
  adminRegister,
  userRegister,
  userLogin,
} from "../../utils/api/authenticationAPI";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomPayload extends JwtPayload {
  role: string;
  contact: string;
}

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

export const loginUser = createAsyncThunk<
  { access: string; refresh: string },
  User,
  { rejectValue: string }
>("login/user", async (user, { rejectWithValue }) => {
  try {
    const response = await userLogin(user);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message) || "Error trying to login";
  }
});

export const logoutUser = createAsyncThunk("logout/user", async () => {
  return null;
});

// clear messages
export const clearMessages = createAsyncThunk<void, void>(
  "settings/clearMessages",
  async () => {
    return;
  }
);

// create a slice to handle authentication/

// create type for the slice
interface authState {
  user: User;
  status: "idle" | "loading" | "succeed" | "failed";
  error: string | null;
  message: string;
}

const initialState: authState = {
  user: {
    username: "",
    contact: "",
    email: "",
    password: "",
    access: sessionStorage.getItem("accessToken") || "", // restore token from sessionStorage
    refresh: "",
  },
  status: "idle",
  error: null,
  message: ""
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // register admin user
      .addCase(registerAdmin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.user = action.payload;
        if (state.user){state.message = "you're In"};
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to register admin";
      })

      // register user
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        if (state.user){state.message = "You're In"};
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to register user";
      })

      // login user
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeed";
        state.user.access = action.payload.access;
        state.user.refresh = action.payload.refresh;
        if (state.user.access){state.message = "Login Success "};
        sessionStorage.setItem("accessToken", action.payload.access);

        const expiryTime = Date.now() + 1800 * 1000; // 30 min in milliseconds
        sessionStorage.setItem("tokenExpiry", expiryTime.toString());

        // check token expiry on app load
        const tokenExpiry = sessionStorage.getItem("tokenExpiry");
        if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("tokenExpiry");
          sessionStorage.removeItem("role");
          sessionStorage.removeItem("contact");
          state.user.access = "";
        }

        // get role and contact
        const decode = jwtDecode<CustomPayload>(action.payload.access);
        sessionStorage.setItem("role", decode.role);
        sessionStorage.setItem("contact", decode.contact);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to login user";
      })

      // logout user
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeed";
        state.user = {
          username: "",
          contact: "",
          email: "",
          password: "",
          access: "",
          refresh: "",
        };
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("tokenExpiry");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("contact");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to logout user";
      })
      // handle clear messages
      .addCase(clearMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearMessages.fulfilled, (state) => {
        state.status = "idle";
        state.message = "";
        state.error = "";
      })
      .addCase(clearMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Could not clear Messages";
      });
  },
});

export default authSlice.reducer;
