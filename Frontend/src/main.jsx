import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Route, Router } from "react-router-dom";
import  {SharingPanel,KeyPanel,CreateUser, FileReceiver}  from "./home/index.js";

<Router>
  <Route path="/" element={<CreateUser />} />
  <Route path="/sender" element={<SharingPanel />} />
  <Route path="/reciver" element={<KeyPanel />} />
  <Route path="/sharedFile" element={<FileReceiver />} />
</Router>;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
