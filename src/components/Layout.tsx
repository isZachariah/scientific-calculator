import {Header} from "./Header";
import {Footer} from "./Footer";
import React, {FC} from "react";

interface LayoutProps {
    children: React.ReactElement
}

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <div className={'w-screen h-screen max-w-full max-h-full dark:bg-slate-800 dark:text-white bg-slate-200'}>
            <Header />
            <div>
                { children }
            </div>
            <Footer />
        </div>
    )
}

export default Layout;