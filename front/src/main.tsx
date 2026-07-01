import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import { StreamProvider } from "./context/StreamContext";
import { AppRouter } from "./router/AppRouter";
import { store } from "./store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <StreamProvider>
        <AppRouter />
      </StreamProvider>
    </Provider>
  </StrictMode>,
);