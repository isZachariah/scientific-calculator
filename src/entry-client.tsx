import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { Router } from "./router";


ReactDOM.hydrateRoot(
    document.getElementById("root") as HTMLElement,
    <BrowserRouter>
        <Router />
    </BrowserRouter>
);

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//     <App Component={Home()}/>
// )