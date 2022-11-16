import React, {ReactElement, useReducer, useState} from "react";
import {parse, resolve, Token} from "./useParser";


type State = {
    overwrite: boolean
    current: string
    answer: string
    history: string[]
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
            console.log(state.current)
            // state.answer = useParser(state.current)
            state.history.unshift(`${state.current} = ${state.answer}`)
            return {
                ...state,
                current: state.answer,
                overwrite: true,
            }

    }
}


// const initQueue: Token[] = []
export const useCalculator = () => {
    const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, { current: '', history: [] })
    // const [queue, setQueue] = useState(initQueue)

    // const useParser = (expr: string) => {
    //     // const [queue, setQueue] = useState(initQueue)
    //     parse(expr, queue, setQueue)
    //     return resolve(queue)
    // }

    const {
        current,
        history,
    } = state


    return {
        dispatch,
        current,
        history,
    }
}