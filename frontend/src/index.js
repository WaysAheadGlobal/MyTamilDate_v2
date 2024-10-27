import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppContextProvider } from "./Context/UseContext";
import UserProfileProvider from "./components/userflow/components/context/UserProfileContext";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google"
import SocketProvider from "./Context/SockerContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AlertModalProvider from "./Context/AlertModalContext";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);


const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GCID}>
    <React.StrictMode>
      <AlertModalProvider>
        <Elements stripe={stripePromise}>
          <SocketProvider>
            <AppContextProvider>
              <UserProfileProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </UserProfileProvider>
            </AppContextProvider>
          </SocketProvider>
        </Elements>
      </AlertModalProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
