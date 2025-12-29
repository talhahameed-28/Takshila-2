import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
// import { WishlistProvider } from "./context/WishlistContext";
import { Toaster } from "react-hot-toast";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster
      containerClassName="z-1000"
      position="top-right"
      reverseOrder={false}
    />
    <Provider store={store}>
      <BrowserRouter>
        {/* <WishlistProvider> */}
          <App />
        {/* </WishlistProvider> */}
      </BrowserRouter>
    </Provider>
      
  </React.StrictMode>
);
