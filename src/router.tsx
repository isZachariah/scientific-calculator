import { Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { NotFound } from "./pages/NotFound";

// Use for SSR
export const Router = () => {
    return (
        <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    );
};

// Use for gh-pages
/**
export const Router = () => {
    return (
        <Routes>
            <Route index path="/scientific-calculator/" element={<Home />} />
            <Route path="/scientific-calculator/about" element={<About />} />
            <Route path="/scientific-calculator/*" element={<NotFound />} />
        </Routes>
    );
};
**/