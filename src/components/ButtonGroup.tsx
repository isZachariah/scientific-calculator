import {FC} from "react";
import {Button} from "./Button";

type ButtonGroupProps = {
    dispatch: () => void
    style: string
    buttons: Button[]
}

type Button = {
    type: string
    value: string
    style: string
}

export const ButtonGroup: FC<ButtonGroupProps> = ({dispatch, style, buttons}) => {
    return (
        <div className={style}>
            {
                buttons.map((btn, index) => (
                    <Button key={index} dispatch={dispatch} type={btn.type} value={btn.value} style={btn.style} />
                ))
            }
        </div>
    )
}