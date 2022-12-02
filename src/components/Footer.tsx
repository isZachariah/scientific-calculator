import {Link} from "react-router-dom";

// use for SSR
export const Footer = () => {
    return (
        <>

            <div className="absolute flex flex-row gap-12 bottom-0 right-12 dark:bg-slate-800 dark:text-white bg-slate-200">
                <Link to={'/about'}><span className={'text-white text-7xl'}>‽</span></Link>
            </div>

        </>
    )
}

// Uncomment for gh-pages
/**
export const Footer = () => {
    return (
        <>

            <div className="absolute flex flex-row gap-12 bottom-0 right-12 dark:bg-slate-800 dark:text-white bg-slate-200">
                <Link to={'/scientific-calculator/about'}><span className={'text-white text-7xl'}>‽</span></Link>
            </div>

        </>
    )
}
**/