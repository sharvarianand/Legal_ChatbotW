import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import { BrowserRouter } from "react-router-dom"; // Added for routing

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter> // Wrap App with BrowserRouter for routing

  <React.StrictMode>
    <App />
  </React.StrictMode>
  </BrowserRouter>
);
