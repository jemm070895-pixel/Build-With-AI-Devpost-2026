import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// La instalación inicial requiere conexión; después, los archivos compilados
// pueden recuperarse de la caché del navegador cuando no haya red.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // El juego sigue funcionando aunque el navegador bloquee el caché.
    });
  });
}
