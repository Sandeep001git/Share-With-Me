import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Route, Router } from "react-router-dom";
import  SharingPanel  from "./home/SharingPanel.jsx";
import KeyPanel from "./home/KeyPanel.jsx";
import CreateUser from "./home/CreateUser.jsx";

<Router>
  <Route path="/" element={<CreateUser />} />
  <Route path="/sender" element={<SharingPanel />} />
  <Route path="/reciver" element={<KeyPanel />} />
</Router>;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
