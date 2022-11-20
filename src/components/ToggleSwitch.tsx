import { useState } from "react";
import useDarkTheme from "../hooks/useDarkTheme";



export const ToggleSwitch = () => {
    const [colorTheme, setTheme] = useDarkTheme();
    const [darkTheme, setDarkTheme] = useState( colorTheme === 'light');

    const toggleDarkMode = (checked: boolean) => {
        setTheme(colorTheme)
        setDarkTheme(checked)
    }

    return (
        <>
            <label>
            <input type="checkbox"
                   className="absolute left-1/2 -translate-x-1/2 peer appearance-none rounded-md"
                   checked={darkTheme}
                   onChange={() => toggleDarkMode(!darkTheme)}
            />
            <span
                className={`w-16 h-7 flex items-center flex-shrink-0 ml-4 p-1 bg-slate-300 rounded-full
                    duration-300 ease-in-out peer-checked:bg-[#ff798c] after:w-8 after:h-8 after:bg-white after:border-black after:border-2
                    after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6
                    group-hover:after:translate-x-1 border-black border-2`}></span>
            </label>
        </>
    )

}