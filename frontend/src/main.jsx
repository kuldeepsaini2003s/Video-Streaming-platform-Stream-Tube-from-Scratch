import React from "react";
import { Provider } from "react-redux";
import store from "./utils/Redux/store.js";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        bodyClassName="toastBody"
        style={{ width: "fit-content" }}
        theme="light"
        transition={Slide}
      />
      <App />
    </Provider>
  </StrictMode>
);
