import {FC} from "react";
import {Button} from "./Button";

type DisplayProps = {
    dispatch: (p: {type: string}) => void
    current: string
}

export const Display: FC<DisplayProps> = ({dispatch, current}) => {
    return (
        <div className={'w-full border-black border-2 flex flex-row max-h-56 h-12 m-3 bg-white align-middle'}>
            <span className={'font-bold text-4xl text-white text-stroke-black text-stroke-2 w-5/6 text-end align-middle m-auto'}>{current}</span>
            <Button dispatch={dispatch}
                    type={'delete'} value={'⌫'}
                    style={'font-bold text-4xl text-white text-stroke-black text-stroke-2 m-0 cursor-pointer relative right-1 align-middle m-auto'} />
        </div>
    )
}

const format = (current: string) => parseFloat(current).toFixed(10).toString()

