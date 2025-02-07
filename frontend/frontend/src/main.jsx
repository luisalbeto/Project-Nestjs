import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import App from "./App";
import "./index.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n"; // Importa tu configuración de i18next

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </CookiesProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
