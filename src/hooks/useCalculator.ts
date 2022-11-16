import React, {useEffect, useReducer, useState} from "react";
import {useParser} from "./useParser";


type State = {
    overwrite: boolean
    current: string
    answer: string
    expr: string
    addToHistory: string
}

type Action = {
    type: string
    payload: Payload
}

type Payload = {
    value: string
}

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
            if (payload.value === '0' && state.current === '0') return state
            if (state.current === '0' && payload.value !== '.') return { ...state, current: payload.value}
            if (payload.value === '.' && state.current.includes('.')) return state
            if (state.current === null || '' || undefined) {
                return {
                    ...state,
                    current: `${payload.value}`,
                }
            }
            if (state.current !== undefined) {
                if (['+','−','×','÷','^'].includes(state.current.slice(-1))) {
                    return {
                        ...state,
                        current: `${state.current} ${payload.value}`
                    }
                }
                return {
                    ...state,
                    current: `${state.current || ''}${payload.value}`,
                }
            }

            return {
                ...state,
                current: `${payload.value}`,
            }
        case 'delete':
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: true,
                    current: null
                }
            }
            if (state.current === null) return state
            if (state.current.length === 1) {
                return { ...state, current: null, overwrite: true}
            }
            return {
                ...state,
                current: state.current.slice(0, -1)
            }
        case 'choose-operator':
            if (state.current === null) return state
            if (['+','-','×','÷','^'].includes(state.current.slice(-1))) {
                return {
                    ...state,
                }
            }
            if (typeof parseInt(state.current.slice(-1)) === 'number') {
                return {
                    ...state,
                    current: `${state.current} ${payload.value}`
                }
            }
            return { ...state }
        case 'percent':
            if (state.current === null || state.current === undefined) return state
            if (typeof parseFloat(state.current) === 'number' ) {
                return {
                    ...state,
                    current: `${parseFloat(state.current) / 100}`
                }
            }
            return state
        case 'negate':
            if (state.current === null || state.current === undefined) {
                return {
                    ...state,
                    current: `-`
                }
            }
            if ( /\d/.test(state.current) || /^-\d+.\d+$/.test(state.current) || /^\d+.\d+$/.test(state.current)) {
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

            return {}
        case 'constant':

            return {}
        case 'random':

            return {}
        case 'evaluate':
            if (state.current === null || '' || undefined) return state
            let answer = useParser(state.current)
            return {
                ...state,
                current: answer,
                addToHistory: `${state.current} = ${answer}`,
                // overwrite: true,
            }

    }
}

const initHistory: string[] = []

export const useCalculator = () => {
    const [{current, addToHistory}, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, { current: '', addToHistory: '' })
    const [history, setHistory] = useState(initHistory)
    const [display, setDisplay] = useState('')

    useEffect(() => {
        setHistory([...history, addToHistory])
    }, [addToHistory])

    useEffect(() => {
        setDisplay(current)
    }, [current])


    return {
        dispatch,
        display,
        history,
    }
}




// const generateOperator= (operation: string,
//                          binaryFunction: ((x: number, y: number) => number),
//                          left: boolean,
//                          precedence: number,
// ) => ({
//     operation,
//     binaryFunction,
//     left,
//     precedence
// });
//
// const OPERATORS = {
//     '+': generateOperator('+', ((x, y) => x + y), true, 2),
//     '−': generateOperator('−', ((x, y) => x - y), true, 2),
//     '×': generateOperator('*', ((x, y) => x * y), true, 3),
//     '÷': generateOperator('/', ((x, y) => x / y), true, 3),
//     'mod': generateOperator('mod', ((x, y) => x % y), true, 3),
//     '^': generateOperator('^', ((x, y) => Math.pow(y, x)), false, 1),
// }
//
// function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
//     return o[propertyName]; // o[propertyName] is of type T[K]
// }
//
// type opNode =  {
//     operation: string
//     binaryFunction: ((x: number, y: number) => number)
//     left: boolean
//     precedence: number
// }
//
// function getPrecedence(element: opNode) {
//     return element.precedence;
// }
//
//
// const greaterPrecedence = (on_stack: opNode, new_el: opNode) => {
//     return getPrecedence(on_stack) > getPrecedence(new_el);
// }
//
// const equalPrecedence = (on_stack: opNode, new_el: opNode) => {
//     return getPrecedence(on_stack) === getPrecedence(new_el) && association(on_stack);
// }
//
// function association(element: opNode) {
//     return element.left
// }