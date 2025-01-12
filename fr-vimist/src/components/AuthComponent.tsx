import React, { useState } from "react";
import { User } from "../utils/api/authenticationAPI";
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

type ThisMessage = {
  message: string;
  class: string;
};

// global variable to hold the token
export let myToken = {
  access: "",
  refresh: "",
};
function AuthComponent({ mode, regAs }: AuthComponentProps) {
  // state to hold the user details
  const [user, setUser] = useState<User>({
    username: "",
    password: "",
    email: "" || null,
    contact: "" || null,
  });


  const [entryError, setError] = useState<ThisMessage>();
  const [entrySuccess, setSuccess] = useState<ThisMessage>();



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
          myToken = result;

          setTimeout(() => {
            navigate("/");
          }, 2000);
        }

        if (loginStatus === "idle" || loginStatus === "loading") {
          setError({
            message: "Loading...",
            class:
              "vn-border-2 vn-border-blue-500 vn-shadow-md vn-text-blue-200",
          });
        } else if (loginStatus === "succeed") {
          setSuccess({
            message: "Success. Redirecting in 3...2..1.",
            class:
              "vn-border-2 vn-border-green-500 vn-shadow-md",
          });
        } else if (loginStatus === "failed") {
          setError({
            message: `Login Failed ${loginError?.toString()}`,
            class:
              "vn-border-2 vn-border-red-500 vn-shadow-md",
          });
        }
      } catch (error) {
        console.error("Login failed", error);
        setError({
          message: "Login Failed",
          class:
            "vn-border-2 vn-border-red-500 vn-shadow-md",
        });
      }
    } else {
      if (regAs === "admin") {
        try {
          await addNewAdmin(user);
          if (addAdminStatus === "succeed") {
            setSuccess({
              message: "Admin Registered Successfully",
              class:
                "vn-border-2 vn-border-green-500 vn-shadow-md",
            });
          } else if (addAdminStatus === "failed") {
            setError({
              message: `Admin registration Failed ${addAdminError?.toString()}`,
              class:
                "vn-border-2 vn-border-red-500 vn-shadow-md",
            });
          }
        } catch (error) {
          console.error("Admin registration failed", error);
        }
      } else if (regAs === "user") {
        try {
          await addNewUser(user);

          if (addUserStatus === "succeed") {
            setSuccess({
              message: "User Registered Successfully",
              class:
                "vn-border-2 vn-border-green-500 vn-shadow-md",
            });
          } else if (addUserStatus === "failed") {
            setError({
              message: `User registration Failed ${addUserError?.toString()}`,
              class:
                "vn-border-2 vn-border-red-500 vn-shadow-md",
            });
          }
        } catch (error) {
          console.error("User registration failed", error);
        }
      }
    }
  };

  // navigate to the home page
  const navigate = useNavigate();

  return (
    <div className="vn-flex vn-flex-col md:vn-flex-row vn-w-full vn-min-h-full vn-justify-evenly vn-m-auto">
      <div className="vn-flex vn-flex-col vn-justify-center vn-gap-5 vn-w-[50%]">
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
      <div className="vn-flex vn-flex-col vn-w-[50%] vn-justify-center"> 
        <h1>{mode === "login" ? "Login" : "Register"}</h1>
        {loginError && (<h2 className="vn-text-red-500"> {loginError}</h2>)}
        {entryError && (<h2 className="vn-text-red-500"> {entryError?.message}</h2>)}
        {entrySuccess && (<h2 className="vn-text-green-500"> {entrySuccess?.message}</h2>)}
        <form
          onSubmit={handleSubmit}
          className={`vn-flex vn-flex-col vn-gap-5 vn-px-2 vn-py-5 vn-w-[50%] vn-items-center vn-rounded-md vn-border vn-border-red-500 vn-shadow-lg
           ${entryError ? entryError?.class : entrySuccess && entrySuccess?.class
          }`}
        >
          <input
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            autoComplete="on"
          />

          {mode === "register" && (
            <>
              {regAs === "admin" && (
                <input
                  type="email"
                  placeholder="Email"
                  value={user.email || ""}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  autoComplete="on"
                />
              )}
              {regAs === "user" && (
                <input
                  type="text"
                  placeholder="Contact"
                  value={user.contact || ""}
                  onChange={(e) =>
                    setUser({ ...user, contact: e.target.value })
                  }
                  autoComplete="on"
                />
              )}
            </>
          )}

          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            autoComplete="off"
          />

          <button type="submit" className="vn-bg-green-400">
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthComponent;
