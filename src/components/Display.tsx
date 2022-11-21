import {FC} from "react";
import {Button} from "./Button";

type DisplayProps = {
    dispatch: (p: {type: string}) => void
    current: string
}

export const Display: FC<DisplayProps> = ({dispatch, current}) => {

    return (
        <div className={'min-w-full max-w-sm border-black border border-2 dark:border-0 dark:border-b-2 p-3 flex flex-row h-24 bg-white dark:bg-[#00798c] align-middle rounded-t-xl'}>
            <span className={'font-bold text-4xl text-white text-stroke-black text-stroke-2 w-5/6 h-20 text-end align-middle m-auto break-all overflow-y-scroll'}>{
                current
            }</span>
            <Button dispatch={dispatch}
                    type={'delete'} value={'⌫'}
                    style={'font-bold text-4xl text-black hover:text-[#00798c] dark:hover:text-[#ff798c] text-stroke-black text-stroke-2 m-0 cursor-pointer relative right-1 align-middle m-auto'}
                    outline={false}

            />
        </div>
    )
}


