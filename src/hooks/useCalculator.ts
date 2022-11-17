import React, {useEffect, useReducer, useState} from "react";
import {useParser} from "./useParser";


type State = {
    overwrite: boolean
    current: string
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
        case 'clear':
            return {
                ...state,
                current: null,
                addToHistory: null
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
            let expr = state.current.slice()
            let answer = useParser(expr)
            return {
                ...state,
                current: answer,
                addToHistory: `${state.current} = ${answer}`,
                // overwrite: true,
            }

    }
}

const unaryFunctions = [
    { 'sin':   (x: number) => Math.sin(x)   },
    { 'cos':   (x: number) => Math.cos(x)   },
    { 'tan':   (x: number) => Math.tan(x)   },
    { 'asin':  (x: number) => Math.asin(x)  },
    { 'acos':  (x: number) => Math.acos(x)  },
    { 'atan':  (x: number) => Math.atan(x)  },
    { 'log':   (x: number) => Math.log(x)   },
    { 'log10': (x: number) => Math.log10(x) },
    { 'sqrt':  (x: number) => Math.sqrt(x)  },
    { 'abs':   (x: number) => Math.abs(x)   },
    { 'round': (x: number) => Math.round(x) },
    { 'floor': (x: number) => Math.floor(x) },
    { 'ceil':  (x: number) => Math.ceil(x)  },
]

const constants = [
    { 'pi':      Math.PI             },
    { 'ln10':    Math.LN10           },
    { 'ln2':     Math.LN2            },
    { 'log2e':   Math.LOG2E          },
    { 'log10e':  Math.LOG10E         },
    { 'sqrt1_2': Math.SQRT1_2        },
    { 'sqrt2':   Math.SQRT2          },
    { 'e':       Math.E              },
    { 'random':  () => Math.random() },
]

const initHistory: string[] = []

export const useCalculator = () => {
    const [{current, addToHistory}, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, { current: '', addToHistory: '' })
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