import {FC} from "react";


type ButtonProps = {
    dispatch: (p: {type: string, payload: {value: string | null}}) => void
    type: string
    value: string | null
    style: string
}

export const Button: FC<ButtonProps> = ({dispatch, type, value, style}) => {
    return (
        <div
            className={'select-none'}
            onClick={() => dispatch({type, payload: {value}})}
        >
            <span className={'w-full h-full select-none' + style}>{value}</span>
        </div>
    )
}