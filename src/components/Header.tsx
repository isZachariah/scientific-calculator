import {ToggleSwitch} from "./ToggleSwitch";
import {Link} from "react-router-dom";


export const Header = () => {
    return (
        <div className={'w-screen max-w-full max-h-full dark:bg-slate-800 dark:text-white bg-slate-200'}>
            <header className={'w-screen h-1/5 flex flex-row m-auto justify-between '}>
                <Link to={'/'}>
                    <span className={"font-bold text-9xl text-white text-stroke-black text-stroke-2 m-3"}>Calculator</span>
                </Link>

                <div className={'flex flex-row m-auto justify-self-end absolute right-4 top-12 gap-12'}>
                    <ToggleSwitch/>
                </div>

            </header>
        </div>
    )
}