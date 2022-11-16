import {FC} from "react";
import {Display} from "./Display";
import {ButtonGroup} from "./ButtonGroup";


type CalcProps = {
    dispatch: () => void
    current: string
}

export const Calculator: FC<CalcProps> = ({dispatch, current}) => {

    return (
        <div className={'flex flex-col w-3/12'}>
            <Display dispatch={dispatch} current={current} />
            <ButtonGroup dispatch={dispatch} style={'grid grid-cols-4 m-3'} buttons={buttons} />
        </div>
    )
}





const buttonStyles = 'font-bold text-6xl text-white text-stroke-black text-stroke-2 m-1 cursor-pointer'
const digitStyle = 'font-bold text-6xl text-white text-stroke-black text-stroke-2 m-1 cursor-pointer'
const opStyles = 'font-bold text-6xl text-white text-stroke-black text-stroke-2 m-1 cursor-pointer'

const buttons = [
    { type: 'clear',  value: 'C',   style: buttonStyles },
    { type: 'negate',  value: '±',   style: buttonStyles },
    { type: 'percent', value: '%',   style: buttonStyles },
    { type: 'choose-operator', value: '^', style: opStyles },

    { type: 'add-digit', value: '1', style: digitStyle },
    { type: 'add-digit', value: '2', style: digitStyle },
    { type: 'add-digit', value: '3', style: digitStyle },
    { type: 'choose-operator', value: '÷', style: opStyles },

    { type: 'add-digit', value: '4', style: digitStyle },
    { type: 'add-digit', value: '5', style: digitStyle },
    { type: 'add-digit', value: '6', style: digitStyle },
    { type: 'choose-operator', value: '×', style: opStyles },

    { type: 'add-digit', value: '7', style: digitStyle },
    { type: 'add-digit', value: '8', style: digitStyle },
    { type: 'add-digit', value: '9', style: digitStyle },
    { type: 'choose-operator', value: '−', style: opStyles },

    { type: 'add-digit', value: '0', style: digitStyle },
    { type: 'add-digit', value: '.', style: digitStyle },
    { type: 'evaluate', value: '=', style: 'font-bold text-6xl text-red text-stroke-black text-stroke-2 m-3 cursor-pointer' },
    { type: 'choose-operator', value: '+', style: opStyles },
]





