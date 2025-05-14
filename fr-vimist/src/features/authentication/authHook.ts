import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { User } from "../../utils/api/authenticationAPI";
import { loginUser, registerAdmin, registerUser, logoutUser, clearMessages } from "./authSlice";
import { useNavigate } from "react-router-dom";

// Hook to display users
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.auth.status);
  const error = useSelector((state: RootState) => state.auth.error);
  const accessToken = useSelector((state: RootState) => state.auth.user.access);
  const message = useSelector((state: RootState) => state.auth.message);

  const authUser = (user:User) => {
      const response = dispatch(loginUser(user));
      return response.unwrap();
  };

    return { authUser, status, error, accessToken, message };
};

// hook to logout user
export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.auth.status);
  const error = useSelector((state: RootState) => state.auth.error);
  const navigate = useNavigate();

  const logout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return { logout, status, error };
};

// Hook to add a new user
export const useAddNewUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.auth.status);
  const error = useSelector((state: RootState) => state.auth.error);
  const message = useSelector((state: RootState) => state.auth.message);

  const addNewUser = (user: User) => {
    const response = dispatch(registerUser(user));
    return response.unwrap();
  };

  return { addNewUser, status, error, message };
};

// Hook to add a new admin
export const useAddNewAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.auth.status);
  const error = useSelector((state: RootState) => state.auth.error);
  const message = useSelector((state: RootState) => state.auth.message);

  const addNewAdmin = (user: User) => {
    const response = dispatch(registerAdmin(user));
    return response.unwrap();
  };

  return { addNewAdmin, status, error, message };
};

// Hook to clear messages
export const useClearMessages = () => {
  const dispatch = useDispatch<AppDispatch>();

  const clsMessages = () => {
    dispatch(clearMessages());
  };

  return { clsMessages };
};