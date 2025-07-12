import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import { Login } from "./pages/Login";
import { Clients } from "./pages/Clients";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/clients" element={<Clients />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
