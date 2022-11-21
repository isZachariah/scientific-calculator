import React, {useEffect, useReducer, useState} from "react";
import {solve} from "./useParser";
import '../extensions/string.extensions';


type State = {
    overwrite: boolean
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

const reducer = (state: State, {type, payload}: Action) => {
    switch (type) {
        case 'add-digit':
            if (state.overwrite) {
                if (payload.value === '.') return overwrite('0.', state)
                return overwrite(payload.value, state)
            }
            return addValue(state.current, payload.value, state)
        case 'delete':
            if (state.overwrite) return {...state, overwrite: true, current: null, }
            if (state.current === null) return state
            if (state.current.length === 1) return { ...state, current: null, overwrite: true,}
            if (lastIsAlpha(state.current)) {
                let i = 1;
                while (lastIsAlpha(state.current.slice(0, -i))) { i++ }
                return {...state, current: state.current.slice(0, -i) }
            }
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
                }
            }
            return {
                ...state,
                current: null,
                overwrite: true,
            }

        case 'choose-operator':
            if (state.overwrite) return state
            if (state.current === null) return state
            return addValue(state.current, payload.value, state)

        case 'left-parens':
            if (state.overwrite || state.current === null) {
                return {...state, current: '(', overwrite: false, }
            }
            return addValue(state.current, payload.value, state)

        case 'right-parens':
            if (state.overwrite) return state
            return addValue(state.current, payload.value, state)

        case 'percent':
            if (state.overwrite) return state
            if (isDigit(state.current)) return {...state, current: `${parseFloat(state.current) / 100}`}
            return state

        case 'negate':
            if (state.overwrite) return state
            if (isDigit(state.current)) return negate(state.current, state)
            return state

        case 'unary-function':
            if (state.overwrite) return overwrite(payload.value, state)
            if (isDecimal(state.current) && payload.value === 'floor' ||
                isDecimal(state.current) && payload.value === 'ceil') {
                if (payload.value === 'ceil') {
                    let answer = Math.ceil(parseFloat(state.current))
                    return { ...state, current: `${answer}`, answer: `${answer}`,
                        addToHistory: `ceil ${state.current} = ${answer}`}
                }
                if (payload.value === 'floor') {
                    let answer = Math.floor(parseFloat(state.current))
                    return { ...state, current: `${answer}`, answer: `${answer}`,
                        addToHistory: `floor ${state.current} = ${answer}`}
                }
            }
            return addValue(state.current, payload.value, state)

        case 'constant':
            let constant = constants[payload.value]()
            if (state.overwrite) return overwrite(constant, state)
            return addValue(state.current, constant, state, true)

        case 'get-answer':
            if (state.overwrite) return overwrite(state.answer, state)
            return addValue(state.current, state.answer, state, true)

        case 'retrieve-history':
            if (state.overwrite) return overwrite(payload.value, state)
            return addValue(state.current, payload.value, state, true)

        case 'evaluate':
            console.log(state)
            if (state.overwrite) return state
            if (isDigit(state.current)) return { ...state, overwrite: true, current: '', addToHistory: `${state.current} = ${state.current}`}
            if (!/\d/.test(state.current)) return {...state, overwrite: true, addToHistory: `${state.current} = Error`, current: 'Error: No digits in expression', }

            // More often than not the program will still run with unbalanced parentheses but I felt like this was a good addition to avoid possible errors
            if (/[(]/.test(state.current) || /[)]/.test(state.current)) {
                let countLeftParentheses = state.current.split('(').length - 1
                let countRightParentheses = state.current.split(')').length - 1
                if (countLeftParentheses !== countRightParentheses) {
                    return {
                        ...state,
                        overwrite: true,
                        addToHistory: `${state.current} = Error`,
                        current: 'Error: Parentheses do not match',
                    }
                }
                return getAnswer(state)
            }

            return getAnswer(state)

        default: return state

    }
}

/** Get Answer
 * **/
const getAnswer = (state: State) => {
    let expr = state.current.split(' ')
    let answer = solve(expr)
    if (isNaN(answer)) return {...state, answer: 0, addToHistory: `${state.current} = Error`, overwrite: true }

    return {
        ...state,
        answer: answer,
        current: '',
        addToHistory: `${state.current} = ${answer}`,
        overwrite: true,
    }
}

/** Overwrite function -- used with every action **/
const overwrite = (value: string, state: State) => {
    return {
        ...state,
        current: `${value}`,
        overwrite: false
    }
}

/** Negate
 * as long as the expression contains only numbers
 * it will be converted to either a negative or positive number, respectively
 * **/
const negate = (expr: string, state: State) => {
    if (parseFloat(expr) > 0) {
        return {
            ...state,
            current: `-${parseFloat(expr)}`
        }
    }
    if (parseFloat(expr) < 0) {
        return {
            ...state,
            current: `${Math.abs(parseFloat(expr))}`
        }
    }
}

/** Helper Boolean Values **/
const isDecimal = (value: string) => /^-?\d*\.\d+$/.test(value)
const isDigit = (value: string) => /^-?\d*\.{0,1}\d+$/.test(value)
const lastIsDigit = (expr: string) => /^\d*\.?\d*$/.test(expr.slice(-1))
const lastIsRightParentheses = (expr: string) => /[)]/.test(expr.slice(-1))
const lastIsLeftParentheses = (expr: string) => /[(]/.test(expr.slice(-1))
const lastIsOperator = (expr: string) => ['+','−','×','÷','^'].includes(expr.slice(-1)) || ['mod'].includes(expr.slice(-3))
const lastIsAlpha = (expr: string) => /[a-z]/.test(expr.slice(-1))
const lastIsAlphaOrOperator = (expr: string) => lastIsOperator(expr) || lastIsAlpha(expr) || lastIsLeftParentheses(expr)

/** AddValue
 * Function for adding values to current based upon the payloads value and current value
 * **/
const addValue = (expr: string, value: string, state: State, retrievedValue=false) => {
    if (retrievedValue) {
        if (lastIsAlphaOrOperator(expr)) return { ...state, current: `${expr} ${value}`, }
        if (lastIsRightParentheses(expr) || lastIsDigit(expr)) {
            return {...state, current: `${expr} × ${value}`}
        }
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
        if (lastIsDigit(expr) || lastIsRightParentheses(expr)) {
            return {...state, current: `${expr} ${value}`,}
        }
    }
    if (lastIsAlpha(value)) {
        if (lastIsAlpha(expr)) return state
        if (lastIsDigit(expr) || lastIsRightParentheses(expr))  return { ...state, current: `${expr} × ${value}`}
        return { ...state, current: `${expr} ${value}`,}
    }
    if (lastIsLeftParentheses(value)) {
        if (lastIsAlphaOrOperator(state.current.slice(-1))) {
            return {...state, parentheses: true, current: `${state.current} (`}
        }
        if (isDigit(state.current.slice(-1)) || lastIsRightParentheses(expr)) {
            return {...state, parentheses: true, current: `${state.current} × (`,}
        }
    }
    if (lastIsRightParentheses(value)) {
        if (lastIsAlphaOrOperator(expr)) return state
        if (lastIsDigit(expr)) return {...state, current: `${state.current} )`, parentheses: false, }
    }
}

/** Currently the parentheses do not self balance. I created an approach originally but it lead to more problems than
 * it did any help, so for now I've decided to leave it to the user. What I would like to implement is a function
 * to replace the above 'addValue' function and keep track of the current cursor and updates it with each value,
 * adding the new values to the correct place and leaving whatever parentheses there are at the end.
 * In this circumstance when you press '(' both the right and left would be printed but the cursor would track
 * where to put additional values. When you press ')' the cursor jumps to the index just beyond the last ')'
 * and you can keep going.
 * **/
const addValueWithParentheses = (expr: string, value: string, cursor: number, state: State) => {

}


//-----------------------------------------------------------------------

const betweenParentheses = (current: string, value: string) => {
    let indexLeft = current.lastIndexOf('(')
    let indexRight = current.lastIndexOf(')')
    return `${current.substring(0, indexLeft+1)} ${current.substring(indexLeft+1, indexRight-1)} ${value} )`
}

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
