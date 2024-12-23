// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Payments from "./pages/Payments";
import Dashboard from "./pages/Dashboard";
import { Provider } from "react-redux";
import store from "./store/store";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Purchases from "./pages/Purchases";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;
