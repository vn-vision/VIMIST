import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { User } from "../../api/authenticationAPI";
import { loginUser, registerAdmin, registerUser } from "./authSlice";

// Hook to display users
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.auth.status);
  const error = useSelector((state: RootState) => state.auth.error);

  const authUser = (user:User) => {
      const response = dispatch(loginUser(user));
      return response.unwrap();
  };

    return { authUser, status, error };
};

// Hook to add a new user
export const useAddNewUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.auth.status);
  const error = useSelector((state: RootState) => state.auth.error);

  const addNewUser = (user: User) => {
    dispatch(registerUser(user));
  };

  return { addNewUser, status, error };
};

// Hook to add a new admin
export const useAddNewAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.auth.status);
  const error = useSelector((state: RootState) => state.auth.error);

  const addNewAdmin = (user: User) => {
    dispatch(registerAdmin(user));
  };

  return { addNewAdmin, status, error };
};