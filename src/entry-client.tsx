import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {Home} from "./pages/Home";

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//     <App Component={Home()}/>
// )
import { BrowserRouter } from "react-router-dom";

import { Router } from "./router";

ReactDOM.hydrateRoot(
    document.getElementById("root") as HTMLElement,
    <BrowserRouter>
        <Router />
    </BrowserRouter>
);