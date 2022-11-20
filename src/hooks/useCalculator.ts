import React, {useEffect, useReducer, useState} from "react";
import {getProperty, solve, useParser} from "./useParser";
import '../extensions/string.extensions';


type State = {
    overwrite: boolean
    parentheses: boolean
    expr: string
    layers: string[]
    current: string
    answer: string
    addToHistory: string
}

type Action = {
    type: string
    payload: Payload
}

type Payload = {
    value: string
}

// AFTER PARENS CLOSE ADD DIGIT ??? 'X'
// MAKE THE HISTORY CLICKABLE AND REACTIVE

const reducer = (state: State, {type, payload}: Action) => {
    switch (type) {
        case 'add-digit':
            if (state.overwrite) {
                if (payload.value === '.') return {...state, current: `0.`, overwrite: false}
                return {
                    ...state,
                    current: payload.value,
                    overwrite: false
                }
            }
            // if (state.parentheses) return addValueWithParentheses(state.expr, payload.value, state, false)
            return addValue(state.current, payload.value, state)
        case 'delete':
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: true,
                    current: null,
                    parentheses: false,
                }
            }
            if (state.current === null) return state
            if (state.current.length === 1) {
                return { ...state, current: null, overwrite: true, parentheses: false }
            }
            if (state.current === '()' || state.current === '( )') {
                return {
                    ...state,
                    current: null,
                    overwrite: true,
                    parentheses: false,
                }
            }
            // if (state.current.slice(-1) === ')') {
            //     let index = state.current.lastIndexOf(')') -1
            //     return {
            //         ...state,
            //         current: state.current.replaceAt(index, '')
            //     }
            //
            // }
            return {
                ...state,
                current: state.current.slice(0, -1)
            }
        case 'clear':
            if (state.current === null) {
                return {
                    ...state,
                    overwrite: true,
                    current: null,
                    addToHistory: null,
                    answer: '0',
                    parentheses: false,
                }
            }
            return {
                ...state,
                current: null,
                overwrite: true,
                parentheses: false,
            }

        case 'choose-operator':
            if (state.overwrite) return state
            if (state.current === null) return state
            // if (state.parentheses) {
            //     if (lastIsOperator(state.expr)) return state
            //     return {
            //         ...state,
            //         expr: `${state.expr} ${payload.value}`,
            //         current: `( ${state.expr} ${payload.value} )`,
            //     }
            // }
            return addValue(state.current, payload.value, state)

        case 'left-parens':
            if (state.overwrite || state.current === null) {

                return {
                    ...state,
                    // expr: '',
                    current: '(',
                    parentheses: true,
                    overwrite: false,
                }
            }
            // if (!state.parentheses) {
            //
            // }
            //
            // if (state.parentheses) {
            //     return {
            //         ...state,
            //
            //     }
            // }
            if (lastIsAlphaOrOperator(state.current.slice(-1))) {
                return {
                    ...state,
                    parentheses: true,
                    current: `${state.current} (`
                }
                // if (state.layers === null) {
                //     if (state.current.length === 0) {
                //         state.layers = []
                //     } else {
                //         state.layers = [state.current, ]
                //     }
                // }
                // return {
                //     ...state,
                //     parentheses: true,
                //     expr: state.current,
                //     layers: [...state.layers, state.expr],
                //     current: `${state.current} ( )`,
                // }
            }
            // if (state.current === '( )') return state
            if (isDigit(state.current.slice(-1))) {
                return {
                    ...state,
                    parentheses: true,
                    // expr: `${state.current} ×`,
                    current: `${state.current} × (`,
                }
            }
            return {}
        case 'right-parens':
            return {
                ...state,
                current: `${state.current} )`,
                parentheses: false,
            }
        case 'percent':
            if (state.overwrite || state.parentheses) return state
            if (isDigit(state.current)) return {...state, current: `${parseFloat(state.current) / 100}`}
            return state
        case 'negate':
            if (state.overwrite) {
                return {
                    ...state,
                    current: `-`,
                    overwrite: false,
                }
            }
            if (state.parentheses) {
                return state
                // let temp = `-${parseFloat(state.expr)}`
                // return {
                //     ...state,
                //     expr: temp,
                //     current: `( ${temp} )`
                // }
            }
            if (isDigit(state.current)) {
                if (parseFloat(state.current) > 0) {
                    return {
                        ...state,
                        current: `-${parseFloat(state.current)}`
                    }
                }
                if (parseFloat(state.current) < 0) {
                    return {
                        ...state,
                        current: `${Math.abs(parseFloat(state.current))}`
                    }
                }
            }
            return state
        case 'unary-function':
            if (state.overwrite) {
                return {
                    ...state,
                    current: payload.value,
                    overwrite: false,
                }
            }
            if (state.parentheses) return state
            return addValue(state.current, payload.value, state)
        case 'constant':
            let constant = constants[payload.value]()
            if (state.overwrite) {
                return {
                    ...state,
                    current: `${constant}`,
                    overwrite: false,
                }
            }
            return addValue(state.current, constant, state, true)

        case 'get-answer':
            if (state.overwrite) {
                return {
                    ...state,
                    current: `${state.answer}`,
                    overwrite: false,
                }
            }
            // if (state.parentheses) {
            //     if (state.expr === ''
            //         || ['+','-','×','÷','^'].includes(state.expr.slice(-1))
            //         || /^[a-z]/.test(state.expr.slice(-1))) {
            //         return {
            //             ...state,
            //             expr: `${state.expr} ${state.answer}`,
            //             current: `( ${state.expr} ${state.answer} )`,
            //         }
            //     }
            //     return {
            //         ...state,
            //         expr: `${state.expr} × ${state.answer}`,
            //         current: `( ${state.expr} × ${state.answer} )`,
            //     }
            // }
            return addValue(state.current, state.answer, state, true)
        case 'retrieve-history':
            if (state.overwrite) {
                return {
                    ...state,
                    current: `${payload.value}`,
                    overwrite: false
                }
            }
            // if (state.parentheses) {
            //     if (state.expr === ''
            //         || ['+','-','×','÷','^'].includes(state.expr.slice(-1))
            //         || /^[a-z]/.test(state.expr.slice(-1))) {
            //         return {
            //             ...state,
            //             expr: `${state.expr} ${payload.value}`,
            //             current: `( ${state.expr} ${payload.value} )`,
            //         }
            //     }
            //     return {
            //         ...state,
            //         expr: `${state.expr} × ${payload.value}`,
            //         current: `( ${state.expr} × ${payload.value} )`,
            //     }
            // }
            return addValue(state.current, payload.value, state, true)
        case 'evaluate':
            if (state.overwrite) return state
            if (isDigit(state.current)) return { ...state, overwrite: true, addToHistory: `${state.current} = ${state.current}`}
            let expr = state.current.split(' ')
            let answer = solve(expr)
            if (isNaN(answer)) {
                return {
                    ...state,
                    answer: 0,
                    addToHistory: `${state.current} = Error`,
                    overwrite: true,
                    parentheses: false,

                }
            }
            return {
                ...state,
                answer: answer,
                addToHistory: `${state.current} = ${answer}`,
                overwrite: true,
                parentheses: false,
            }

    }
}

/** Boolean Values **/
const isDigit = (value: string) => /-?\d+.?\d$/.test(value)
const lastIsDigit = (expr: string) => /^\d*\.?\d*$/.test(expr.slice(-1))
const lastIsRightParentheses = (expr: string) => /[)]/.test(expr.slice(-1))
const lastIsLeftParentheses = (expr: string) => /[(]/.test(expr.slice(-1))
const lastIsOperator = (expr: string) => ['+','-','×','÷','^'].includes(expr.slice(-1)) || ['mod'].includes(expr.slice(-3))
const lastIsAlpha = (expr: string) => /[a-z]/.test(expr.slice(-1))
const lastIsAlphaOrOperator = (expr: string) => lastIsOperator(expr) || lastIsAlpha(expr) || lastIsLeftParentheses(expr)

const addValue = (expr: string, value: string, state: State, retrievedValue=false) => {
    if (retrievedValue) {
        if (lastIsAlphaOrOperator(expr)) return { ...state, current: `${expr} ${value}`, }
        if (lastIsRightParentheses(expr) || lastIsDigit(expr)) return { ...state, current: `${expr} × ${value}` }
    }
    if (lastIsDigit(value)) {
        if (expr  === '0' && value === '0') return state
        if (expr  === ''  && value === '.') return {...state, current: `0.`}
        if (expr  === '0' && value !== '.') return { ...state, current: value}
        if (value === '.' && expr.includes('.')) return state
        if (lastIsDigit(expr)) return { ...state, current: `${expr}${value}`, }
        if (lastIsAlphaOrOperator(expr)) return { ...state, current: `${expr} ${value}`, }
        if (lastIsRightParentheses(expr)) return { ...state, current: `${expr} × ${value}` }
        return {
            ...state,
            current: `${state.current || ''}${value}`,
        }
    }
    if (lastIsOperator(value)) {
        if (lastIsAlphaOrOperator(expr)) return state
        if (lastIsDigit(expr) || lastIsRightParentheses(expr)) return { ...state, current: `${expr} ${value}`, }
    }
    if (lastIsAlpha(value)) {
        if (lastIsAlpha(expr)) return state
        if (lastIsDigit(expr) || lastIsRightParentheses(expr))  return { ...state, current: `${expr} × ${value}`}
        return { ...state, current: `${expr} ${value}`,}
    }
}

const addValueWithParentheses = (expr: string, value: string, state: State, mult: boolean) => {
    if (lastIsAlphaOrOperator(expr)) {
        return {
            ...state,
            expr: `${expr} ${value}`,
            current: `( ${expr} ${value} )`
        }
    }
    if (mult) {
        return {
            ...state,
            expr: `${expr} × ${value}`,
            current: `( ${expr} × ${value} )`
        }
    }
    return {
        ...state,
        expr: `${expr}${value}`,
        current: `( ${expr}${value} )`
    }
}


//-----------------------------------------------------------------------

const betweenParentheses = (current: string, value: string) => {
    let indexLeft = current.lastIndexOf('(')
    let indexRight = current.lastIndexOf(')')
    return `${current.substring(0, indexLeft+1)} ${current.substring(indexLeft+1, indexRight-1)} ${value} )`
}

// TO DO figure out how to completely clear the main display without clearing history too

const solveUnary = (expr: string) => {
    unary.filter(func => expr.includes(func))
        .forEach(func => {

        })
    // unary.forEach(func => {
    //     let i = expr.indexOf(func)
    //     if (i > -1) {
    //         let [express, un] = expr.slice(i)
    //
    //     }
    // })
}

const unary = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'log10', 'sqrt', 'abs', 'floor', 'ciel']

const unaryFunctions = [
    { 'sin':   (x: number) => Math.sin(x)   },
    { 'cos':   (x: number) => Math.cos(x)   },
    { 'tan':   (x: number) => Math.tan(x)   },
    { 'asin':  (x: number) => Math.asin(x)  },
    { 'acos':  (x: number) => Math.acos(x)  },
    { 'atan':  (x: number) => Math.atan(x)  },
    { 'ln':    (x: number) => Math.log(x)   },
    { 'log':   (x: number) => Math.log10(x) },
    { 'sqrt':  (x: number) => Math.sqrt(x)  },
    { 'abs':   (x: number) => Math.abs(x)   },
    { 'floor': (x: number) => Math.floor(x) },
    { 'ceil':  (x: number) => Math.ceil(x)  },
]

const constants = {
    'π':       () => Math.PI.toFixed(10),
    'e':       () => Math.E.toFixed(10),
    '0 ↔ 1':   () => Math.random().toFixed(3),
    '1 ↔ 10':  () => Math.floor(Math.random() * 10 + 1),
    '1 ↔ 100': () => Math.floor(Math.random() * 100 + 1),
}

const initHistory: string[] = []

export const useCalculator = () => {
    const [{current, addToHistory}, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, { current: '', answer: '0', addToHistory: null, overwrite: true })
    const [history, setHistory] = useState(initHistory)
    const [display, setDisplay] = useState('')

    useEffect(() => {
        if (addToHistory === null) {
            setHistory(initHistory)
            return () => setHistory(initHistory)
        }
        setHistory([...history, addToHistory])
        return () => setHistory([...history, addToHistory])
    }, [addToHistory])

    useEffect(() => {
        setDisplay(current)
        return () => setDisplay(current)
    }, [current])


    return {
        dispatch,
        display,
        history,
    }
}
