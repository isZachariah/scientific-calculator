import {FC} from "react";


type ButtonProps = {
    dispatch: (p: {type: string, payload: {value: string | null}}) => void
    type: string
    value: string | null
    style: string
    outline: boolean
}

export const Button: FC<ButtonProps> = ({dispatch, type, value, style, outline = true}) => {
    return (
        <div
            className={'select-none'}
            onClick={() => dispatch({type, payload: {value}})}
        >
            {
                outline ? <span className={'w-full h-full select-none' + style}>{value}</span>
                    : <div className={'w-full h-full select-none' + style}>{value}</div>
            }

        </div>
    )
}