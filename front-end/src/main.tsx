import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./App.css";

const queryClient = new QueryClient();

const storedTheme = localStorage.getItem("bunker-theme");
document.documentElement.setAttribute(
  "data-theme",
  storedTheme === "bunker-light" ? "bunker-light" : "bunker-dark"
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
