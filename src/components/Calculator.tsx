import {FC, useState} from "react";
import {Display} from "./Display";
import {ButtonGroup} from "./ButtonGroup";


type CalcProps = {
    dispatch: () => void
    current: string
}

export const Calculator: FC<CalcProps> = ({dispatch, current}) => {
    const [inverse, setInverse] = useState(false)
    return (
        <div className={'w-fit flex-none flex-wrap flex flex-row p-2 border-black border-2 rounded-xl dark:border-[#93b7be]'}>

            <div className={'flex flex-col min-w-lg min-w-sm dark:bg-[#00798c] rounded-xl'}>
                <Display dispatch={dispatch} current={current} />
                <div className={'flex flex-row py-3 h-96'}>
                    {/*<div className={'border border-black w-0'}/>*/}
                    <div className={'pr-5 w-32'}>
                        <button
                            onClick={() => setInverse(!inverse) }
                            className={'border border-black border-2 px-5 ml-5 rounded-xl text-2xl hover:bg-[#ff798c]'}
                        >{inverse ? '←' : '→'}</button>
                        <div>{ !inverse && <ButtonGroup dispatch={dispatch} style={'flex flex-row gap-10 px-4 pt-2'} buttons={parens} outline={false}/>}</div>
                        <ButtonGroup dispatch={dispatch} style={'flex flex-col m-3 '} buttons={
                            inverse ? inverseUnaryFunctions : unaryFunctions
                        } outline={false}/>

                    </div>
                    <div className={'border border-black w-0'}/>
                    <ButtonGroup dispatch={dispatch} style={'grid grid-cols-4 m-3 min-w-fit '} buttons={buttons} outline={true}/>
                    {/*<div className={'border border-black w-0'}/>*/}
                </div>

                <div className={'border border-black h-0'}/>
                <ButtonGroup dispatch={dispatch} style={'flex flex-row m-3 gap-5'} buttons={constants} outline={false}/>
                {/*<div className={'border border-black h-0'}/>*/}

            </div>

        </div>
        
    )
}





const buttonStyles = 'font-bold text-6xl text-white text-stroke-black text-stroke-2 m-1 cursor-pointer hover:text-slate-400 '
const digitStyle = 'font-bold text-6xl text-white text-stroke-black text-stroke-2 m-1 cursor-pointer hover:text-pink-200 '
const opStyles = 'font-bold text-6xl text-white text-stroke-black text-stroke-2 m-1 cursor-pointer hover:text-slate-600'
const funcStyles = 'font-bold text-4xl text-black text-stroke-black text-stroke-2 m-0 cursor-pointer hover:text-[#ff798c] '
const constantStyles = 'font-bold text-2xl text-black  m-1 hover:text-[#00798c] dark:hover:text-[#ff798c] cursor-pointer'

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
    { type: 'evaluate', value: '=', style: 'font-bold text-6xl text-red text-stroke-black dark:text-stroke-white text-stroke-2 m-3 cursor-pointer hover:text-white dark:hover:text-black' },
    { type: 'choose-operator', value: '+', style: opStyles },
]

const unaryFunctions = [
    { type: 'get-answer',     value: 'ans',   style: funcStyles },
    { type: 'choose-operator', value: 'mod',  style: funcStyles },
    { type: 'unary-function', value: 'ln',   style: funcStyles  },
    { type: 'unary-function', value: 'sqrt',  style: funcStyles },
    { type: 'unary-function', value: 'ceil',  style: funcStyles },
    { type: 'unary-function', value: 'floor', style: funcStyles },


]

const inverseUnaryFunctions = [
    { type: 'unary-function', value: 'sin',   style: funcStyles },
    { type: 'unary-function', value: 'cos',   style: funcStyles },
    { type: 'unary-function', value: 'tan',   style: funcStyles },
    { type: 'unary-function', value: 'asin',  style: funcStyles },
    { type: 'unary-function', value: 'acos',  style: funcStyles },
    { type: 'unary-function', value: 'atan',  style: funcStyles },
    { type: 'unary-function', value: 'log',   style: funcStyles },
]

const parens = [
    { type: 'left-parens', value: '(',  style: funcStyles },
    { type: 'right-parens', value: ')', style: funcStyles },
]

const constants = [
    { type: 'constant', value: 'e',        style: constantStyles  },
    { type: 'constant', value: 'π',        style: constantStyles  },

    { type: 'constant',   value: '0 ↔ 1',  style: constantStyles  },
    { type: 'constant',   value: '1 ↔ 10', style: constantStyles  },
    { type: 'constant',   value: '1 ↔ 100', style: constantStyles  },

]


