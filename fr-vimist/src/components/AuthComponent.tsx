import React, { useState } from "react";
import { User } from "../utils/api/authenticationAPI";
import {
  useAuth,
  useAddNewAdmin,
  useAddNewUser,
  useClearMessages,
} from "../features/authentication/authHook";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.jpg";
import { useAddNewCustomer } from "../features/customers/customerHook";
import { Customer } from "../utils/api/customerAPI";
import { useFetchSettings } from "../features/settings/settingsHook";
import AlertMessage from "./AlertMessage";

type AuthComponentProps = {
  mode: "login" | "register";
  regAs: "admin" | "user" | null;
};

type ThisMessage = {
  message: string;
  class: string;
};

function AuthComponent({ mode, regAs }: AuthComponentProps) {
  const { data: confData } = useFetchSettings();
  // state to hold the user details
  const [user, setUser] = useState<User>({
    username: "",
    password: "",
    email: "" || null,
    contact: "" || null,
  });

  const [entryError, setError] = useState<ThisMessage>();
  const [entrySuccess, setSuccess] = useState<ThisMessage>();
  const [customa, setCustoma] = useState<Customer>({
    id: 0,
    name: "",
    contact_info: "",
  });

  // use the custom hooks to handle the user registration and login
  const { authUser, status: loginStatus, error: loginError, message: loginMessage } = useAuth();
  const {clsMessages} = useClearMessages();
  const {
    addNewAdmin,
    status: addAdminStatus,
    error: addAdminError,
    message: adminMessage
  } = useAddNewAdmin();
  const {
    addNewUser,
    status: addUserStatus,
    error: addUserError,
    message: userMessage
  } = useAddNewUser();

  // custom hook to record customer
  const { addCustomer } = useAddNewCustomer();

  //  handle user registration and login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      try {
        const result = await authUser(user);
        if (result) {
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }

        if (loginStatus === "idle" || loginStatus === "loading") {
          setError({
            message: "Loading...",
            class:
              "vn-border-2 vn-text-primary vn-shadow-md vn-text-blue-200",
          });
        } else if (loginStatus === "succeed") {
          setSuccess({
            message: "Success. Redirecting in 3...2..1.",
            class: "vn-border-2 vn-border-green-500 vn-shadow-md",
          });
        } else if (loginStatus === "failed") {
          setError({
            message: `Login Failed ${loginError?.toString()}`,
            class: "vn-border-2 vn-border-red-500 vn-shadow-md",
          });
        }
      } catch (error) {
        console.error("Login failed", error);
        setError({
          message: "Login Failed",
          class: "vn-border-2 vn-border-red-500 vn-shadow-md",
        });
      }
    } else {
      if (regAs === "admin") {
        try {
          const result = await addNewAdmin(user);
          if (result) {
            await addCustomer(customa);
            setTimeout(() => {
              navigate("/");
            }, 2000);
          }

          if (addAdminStatus === "succeed") {
            setSuccess({
              message: "Admin Registered Successfully",
              class: "vn-border-2 vn-border-green-500 vn-shadow-md",
            });
          } else if (addAdminStatus === "failed") {
            setError({
              message: `Admin registration Failed ${addAdminError?.toString()}`,
              class: "vn-border-2 vn-border-red-500 vn-shadow-md",
            });
          }
        } catch (error) {
          console.error("Admin registration failed", error);
        }
      } else if (regAs === "user") {
        try {
          const result = await addNewUser(user);
          if (result) {
            await addCustomer(customa);
            setTimeout(() => {
              navigate("/");
            }, 2000);
          }

          if (addUserStatus === "succeed") {
            setSuccess({
              message: "User Registered Successfully",
              class: "vn-border-2 vn-border-green-500 vn-shadow-md",
            });
            setTimeout(() => {
              navigate("/");
            }, 2000);
          } else if (addUserStatus === "failed") {
            setError({
              message: `User registration Failed ${addUserError?.toString()}`,
              class: "vn-border-2 vn-border-red-500 vn-shadow-md",
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
<div className="vn-flex vn-flex-col md:vn-flex-row vn-w-full vn-min-h-screen vn-items-center vn-justify-evenly">
  <div className="vn-flex vn-flex-col vn-items-center vn-gap-5 vn-w-full md:vn-w-1/2">
    <img
      src={logo}
      alt="logo"
      className="vn-w-16 vn-h-16 vn-rounded-full md:vn-w-20 md:vn-h-20 vn-mx-auto vn-cursor-pointer hover:vn-scale-105"
      onClick={() => navigate("/")}
    />
    <p className="vn-text-center vn-text-sm md:vn-text-base vn-text-gray-700">
      Welcome to {confData.length > 0 && confData[0].system_name}, don’t just window shop, try it out...
    </p>
  </div>

  <div className="vn-flex vn-flex-col vn-items-center vn-w-full md:vn-w-1/2 vn-px-4">
    <h1 className="vn-text-lg md:vn-text-2xl vn-font-bold">{mode === "login" ? "Login" : "Register"}</h1>
    {loginError && <AlertMessage message={loginError} type="error" onClose={clsMessages}/>}
    {addAdminError && <AlertMessage message={addAdminError} type="error" onClose={clsMessages}/>}
    {addUserError && <AlertMessage message={addUserError} type="error" onClose={clsMessages}/>}

    {loginMessage && <AlertMessage message={loginMessage} type="success" onClose={clsMessages}/>}
    {adminMessage && <AlertMessage message={adminMessage} type="success" onClose={clsMessages}/> }
    {userMessage && <AlertMessage message={userMessage} type="success" onClose={clsMessages}/> }

    {loginError && <h2 className="vn-text-red-500 vn-text-sm md:vn-text-base">{loginError}</h2>}
    {entryError && <h2 className="vn-text-red-500 vn-text-sm md:vn-text-base">{entryError?.message}</h2>}
    {entrySuccess && <h2 className="vn-text-green-500 vn-text-sm md:vn-text-base">{entrySuccess?.message}</h2>}

    <form
      onSubmit={handleSubmit}
      className="vn-flex vn-flex-col vn-gap-4 vn-w-full sm:vn-w-3/4 md:vn-w-2/3 lg:vn-w-1/2 vn-bg-white vn-p-6 vn-rounded-lg vn-shadow-md"
    >
      <input
        type="text"
        placeholder="Username"
        value={user.username}
        onChange={(e) => {
          setUser({ ...user, username: e.target.value });
          setCustoma({ ...customa, name: e.target.value });
        }}
        autoComplete="on"
        className="vn-p-2 vn-border vn-border-gray-300 vn-rounded-md focus:vn-outline-none focus:vn-ring-2 focus:vn-ring-green-400"
      />

      {mode === "register" && (
        <>
          {regAs === "admin" && (
            <input
              type="email"
              placeholder="Email"
              value={user.email || ""}
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
                setCustoma({ ...customa, contact_info: e.target.value });
              }}
              autoComplete="on"
              className="vn-p-2 vn-border vn-border-gray-300 vn-rounded-md focus:vn-outline-none focus:vn-ring-2 focus:vn-ring-green-400"
            />
          )}
          {regAs === "user" && (
            <input
              type="text"
              placeholder="Contact"
              value={user.contact || ""}
              onChange={(e) => {
                setUser({ ...user, contact: e.target.value });
                setCustoma({ ...customa, contact_info: e.target.value });
              }}
              autoComplete="on"
              className="vn-p-2 vn-border vn-border-gray-300 vn-rounded-md focus:vn-outline-none focus:vn-ring-2 focus:vn-ring-green-400"
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
        className="vn-p-2 vn-border vn-border-gray-300 vn-rounded-md focus:vn-outline-none focus:vn-ring-2 focus:vn-ring-green-400"
      />

      <button
        type="submit"
        className="vn-bg-primary vn-text-white vn-font-semibold vn-py-2 vn-rounded-md vn-shadow-md hover:vn-bg-secondary hover:vn-scale-105 transition-transform duration-200"
      >
        {mode === "login" ? "Login" : "Register"}
      </button>
    </form>

    {mode === "login" ? (
      <button
        className="vn-text-black vn-text-sm vn-mt-3 vn-shadow-md vn-py-1 vn-px-4 vn-rounded-md hover:vn-bg-gray-100"
        onClick={() => navigate("/register")}
      >
        Don’t have an account? Join the fun
      </button>
    ) : (
      <button
        className="vn-text-black vn-text-sm vn-mt-3 vn-shadow-md vn-py-1 vn-px-4 vn-rounded-md hover:vn-bg-gray-100"
        onClick={() => navigate("/login")}
      >
        Have an account? Welcome.
      </button>
    )}
  </div>
</div>

  );
}

export default AuthComponent;
