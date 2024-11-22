import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";

// Verifique explicitamente se o elemento 'root' não é nulo
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Declara explicitamente o tipo do elemento raiz
const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Reporte os dados de performance da aplicação
reportWebVitals();
