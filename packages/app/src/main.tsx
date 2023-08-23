import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";

// This needs to be added programmatically to avoid the path being mangled.
const addManifest = () => {
    const manifestLink = document.createElement("link");
    manifestLink.rel = "manifest";
    manifestLink.href = "/manifest.webmanifest";
    document.head.appendChild(manifestLink);
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
addManifest();
