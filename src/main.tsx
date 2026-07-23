import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { DesignSettingsProvider } from "./application/context/DesignSettingsContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DesignSettingsProvider>
      <App />
    </DesignSettingsProvider>
  </StrictMode>
);
