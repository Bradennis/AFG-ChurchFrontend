import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ContextApi from "./Context/ContextApi.jsx";
import "./chartSetup";
import "chart.js/auto";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ContextApi>
    <App />
  </ContextApi>
  // </StrictMode>
);
