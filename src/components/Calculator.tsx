import {FC} from "react";
import {Display} from "./Display";
import {ButtonGroup} from "./ButtonGroup";


type CalcProps = {
    dispatch: () => void
    current: string
}

export const Calculator: FC<CalcProps> = ({dispatch, current}) => {

    return (
        <div className={'flex flex-col min-w-3/12'}>
            <Display dispatch={dispatch} current={current} />
            <div>
                <ButtonGroup dispatch={dispatch} style={'grid grid-cols-4 m-3'} buttons={buttons} />
            </div>

        </div>
    )
}





const buttonStyles = 'font-bold text-6xl text-white text-stroke-black text-stroke-2 m-1 cursor-pointer'
const digitStyle = 'font-bold text-6xl text-white text-stroke-black text-stroke-2 m-1 cursor-pointer'
const opStyles = 'font-bold text-6xl text-white text-stroke-black text-stroke-2 m-1 cursor-pointer'
const funcStyles = 'font-bold text-6xl text-white text-stroke-black text-stroke-2 m-1 cursor-pointer'
const constantStyles = 'font-bold text-6xl text-white text-stroke-black text-stroke-2 m-1 cursor-pointer'

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

const unaryFunctions = [
    { type: 'unary-function', value: 'sin', style: funcStyles   },
    { type: 'unary-function', value: 'cos', style: funcStyles   },
    { type: 'unary-function', value: 'tan', style: funcStyles   },
    { type: 'unary-function', value: 'log', style: funcStyles   },
    { type: 'unary-function', value: 'sqrt', style: funcStyles  },
    { type: 'unary-function', value: 'round', style: funcStyles },
]

const inverseUnaryFunctions = [
    { type: 'unary-function', value: 'asin', style: funcStyles   },
    { type: 'unary-function', value: 'acos', style: funcStyles   },
    { type: 'unary-function', value: 'atan', style: funcStyles   },
    { type: 'unary-function', value: 'log10', style: funcStyles  },
    { type: 'unary-function', value: 'ceil', style: funcStyles   },
    { type: 'unary-function', value: 'floor', style: funcStyles },
]

const constants = [
    { type: 'constant', value: 'pi',      style: constantStyles  },
    { type: 'constant', value: 'ln10',    style: constantStyles  },
    { type: 'constant', value: 'ln2',     style: constantStyles  },
    { type: 'constant', value: 'log2e',   style: constantStyles  },
    { type: 'constant', value: 'log10e',  style: constantStyles  },
    { type: 'constant', value: 'sqrt1_2', style: constantStyles  },
    { type: 'constant', value: 'sqrt2',   style: constantStyles  },
    { type: 'constant', value: 'e',       style: constantStyles  },
    { type: 'random',   value: 'random',  style: constantStyles  },
]



