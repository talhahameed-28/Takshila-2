import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import {HelmetProvider} from "react-helmet-async";

// import { WishlistProvider } from "./context/WishlistContext";
import { Toaster } from "react-hot-toast";

// Log version info to console
const version = __APP_VERSION__;
const buildTime = __BUILD_TIME__;
console.log(`%c🚀 Takshila v${version}`, 'color: #4CAF50; font-size: 16px; font-weight: bold');
console.log(`%c📅 Built: ${buildTime}`, 'color: #2196F3; font-size: 12px');


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster
      containerClassName="z-1000"
      position="top-right"
      reverseOrder={false}
    />
    <Provider store={store}>
      <HelmetProvider>

        <BrowserRouter>
          {/* <WishlistProvider> */}
            <App />
          {/* </WishlistProvider> */}
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
      
  </React.StrictMode>
);
