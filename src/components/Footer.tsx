import {Link} from "react-router-dom";


export const Footer = () => {
    return (
        <>

            <div className="absolute flex flex-row gap-12 bottom-0 right-12 dark:bg-slate-800 dark:text-white bg-slate-200">
                <Link to={'/about'}><span className={'text-white text-7xl'}>‽</span></Link>
            </div>

        </>
    )
}

