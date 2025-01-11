import React from "react";
import { User } from "../api/authenticationAPI";
import {
  useAuth,
  useAddNewAdmin,
  useAddNewUser,
} from "../features/authentication/authHook";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.jpg";

type AuthComponentProps = {
  mode: "login" | "register";
  regAs: "admin" | "user" | null;
};

function AuthComponent({ mode, regAs }: AuthComponentProps) {
  // state to hold the user details
  const [user, setUser] = React.useState<User>({
    username: "",
    password: "",
    email: "" || null,
    contact: "" || null,
  });

  // use the custom hooks to handle the user registration and login
  const { authUser, status: loginStatus, error: loginError } = useAuth();
  const {
    addNewAdmin,
    status: addAdminStatus,
    error: addAdminError,
  } = useAddNewAdmin();
  const {
    addNewUser,
    status: addUserStatus,
    error: addUserError,
  } = useAddNewUser();

  //  handle user registration and login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      try {
        const result = await authUser(user);
        if (result) {
          console.log("Login successful");

          // store the tokens in the local storage
          localStorage.setItem("access", result.access);
          localStorage.setItem("refresh", result.refresh);
          navigate("/");
        }
      } catch (error) {
        console.error("Login failed", error);
      }
    } else {
      if (regAs === "admin") {
        try {
          await addNewAdmin(user);
          console.log("Admin registration successful");
        } catch (error) {
          console.error("Admin registration failed", error);
        }
      } else if (regAs === "user") {
        try {
          await addNewUser(user);
          console.log("User registration successful");
        } catch (error) {
          console.error("User registration failed", error);
        }
      }
    }
  };

  // navigate to the home page
  const navigate = useNavigate();

  return (
    <div className="vn-flex vn-flex-col md:vn-flex-row vn-w-full vn-h-full vn-justify-around">
      <div className="vn-flex vn-flex-col vn- justify-evenly">
        <img
          src={logo}
          alt="logo"
          className="vn-w-20 vn-h-20 vn-mx-auto"
          onClick={() => navigate("/")}
        />
        <p className="vn-text-center">
          Welcome to Vimist, don't just window shop, try it out ...
        </p>
      </div>
      <div>
        <h1>{mode === "login" ? "Login" : "Register"}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            autoComplete="on"
          />
          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            autoComplete="off"
          />
          {mode === "register" && (
            <>
              <input
                type="email"
                placeholder="Email"
                value={user.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                autoComplete="on"
              />
              <input
                type="text"
                placeholder="Contact"
                value={user.contact || ""}
                onChange={(e) => setUser({ ...user, contact: e.target.value })}
                autoComplete="on"
              />
            </>
          )}
          <button type="submit" className="vn-bg-green-400">
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthComponent;
