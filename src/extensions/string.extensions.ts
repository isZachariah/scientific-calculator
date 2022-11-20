
interface String {
    replaceAt(index: number, replacement: string): string
}

String.prototype.replaceAt = function (index: number, replacement: string) {
    if (index >= this.length) {
        return this.valueOf();
    }

    return this.substring(0, index) + replacement + this.substring(index + 1);
}



export {}

// import React, {useEffect, useReducer, useState} from "react";
// import {getProperty, useParser} from "./useParser";
// import '../extensions/string.extensions';
//
//
// type State = {
//     overwrite: boolean
//     parentheses: boolean
//     expr: string
//     current: string
//     answer: string
//     addToHistory: string
// }
//
// type Action = {
//     type: string
//     payload: Payload
// }
//
// type Payload = {
//     value: string
// }
//
// const reducer = (state: State, {type, payload}: Action) => {
//     switch (type) {
//         case 'add-digit':
//             if (state.overwrite) {
//                 if (payload.value === '.') return {...state, current: `0.`, overwrite: false}
//                 return {
//                     ...state,
//                     current: payload.value,
//                     overwrite: false
//                 }
//             }
//             if (payload.value === '0' && state.current === '0') return state
//             if (state.current === '0' && payload.value !== '.') return { ...state, current: payload.value}
//             if (payload.value === '.' && state.current.includes('.')) return state
//             if (state.current === null || '' || undefined) {
//                 return {
//                     ...state,
//                     current: `${payload.value}`,
//                 }
//             }
//             if (state.current !== undefined) {
//                 if (['+','−','×','÷','^'].includes(state.current.slice(-1))) {
//                     return {
//                         ...state,
//                         current: `${state.current} ${payload.value}`
//                     }
//                 }
//                 if (state.current.slice(-1) === ')') {
//                     let indexLeft = state.current.lastIndexOf('(')
//                     let indexRight = state.current.lastIndexOf(')')
//                     return {
//                         ...state,
//                         current: `${state.current.substring(0, indexLeft+1)} ${state.current.substring(indexLeft+1, indexRight-1)}${payload.value} )`
//                     }
//
//                 }
//                 return {
//                     ...state,
//                     current: `${state.current || ''}${payload.value}`,
//                 }
//             }
//
//             return {
//                 ...state,
//                 current: `${payload.value}`,
//             }
//         case 'delete':
//             if (state.overwrite) {
//                 return {
//                     ...state,
//                     overwrite: true,
//                     current: null
//                 }
//             }
//             if (state.current === null) return state
//             if (state.current.length === 1) {
//                 return { ...state, current: null, overwrite: true}
//             }
//             if (state.current === '()' || state.current === '( )') {
//                 return {
//                     ...state,
//                     current: null,
//                     overwrite: true
//                 }
//             }
//             if (state.current.slice(-1) === ')') {
//                 let index = state.current.lastIndexOf(')') -1
//                 return {
//                     ...state,
//                     current: state.current.replaceAt(index, '')
//                 }
//
//             }
//             return {
//                 ...state,
//                 current: state.current.slice(0, -1)
//             }
//         case 'clear':
//             if (state.current === null) {
//                 return {
//                     ...state,
//                     current: null,
//                     addToHistory: null,
//                     answer: '0',
//                 }
//             }
//             return {
//                 ...state,
//                 current: null,
//                 overwrite: true,
//             }
//
//         case 'choose-operator':
//             if (state.overwrite) return state
//             if (state.current === null) return state
//             if (['+','-','×','÷','^'].includes(state.current.slice(-1))) {
//                 return {
//                     ...state,
//                 }
//             }
//             if (state.current.slice(-1) === ')') {
//                 let current = betweenParentheses(state.current, payload.value)
//                 return {
//                     ...state,
//                     current: current
//                 }
//             }
//             if (typeof parseInt(state.current.slice(-1)) === 'number') {
//                 return {
//                     ...state,
//                     current: `${state.current} ${payload.value}`
//                 }
//             }
//
//             return { ...state }
//         case 'left-parens':
//             if (state.overwrite || state.current === null) {
//                 return {
//                     ...state,
//                     current: '( )',
//                     overwrite: false,
//                 }
//             }
//             if (['+','-','×','÷','^'].includes(state.current.slice(-1))) {
//                 return {
//                     ...state,
//                     current: `${state.current} ( )`,
//                 }
//             }
//             if (typeof parseInt(state.current.slice(-1)) === 'number') {
//                 return {
//                     ...state,
//                     current: `${state.current} × ( )`,
//                 }
//             }
//             return {}
//         case 'right-parens':
//             return {}
//         case 'percent':
//             if (state.overwrite) {
//                 return {
//                     ...state,
//                 }
//             }
//             if (typeof parseFloat(state.current) === 'number' ) {
//                 return {
//                     ...state,
//                     current: `${parseFloat(state.current) / 100}`
//                 }
//             }
//             return state
//         case 'negate':
//             if (state.overwrite) {
//                 return {
//                     ...state,
//                     current: `-`,
//                     overwrite: false,
//                 }
//             }
//             if ( /\d/.test(state.current) || /^-\d+.\d+$/.test(state.current) || /^\d+.\d+$/.test(state.current)) {
//                 if (parseFloat(state.current) > 0) {
//                     return {
//                         ...state,
//                         current: `-${parseFloat(state.current)}`
//                     }
//                 }
//                 if (parseFloat(state.current) < 0) {
//                     return {
//                         ...state,
//                         current: `${Math.abs(parseFloat(state.current))}`
//                     }
//                 }
//             }
//             return state
//         case 'unary-function':
//
//             return {
//                 ...state,
//                 current: `${state.current} ${payload.value}()`
//             }
//         case 'constant':
//             let constant = constants[payload.value]
//             if (state.overwrite) {
//                 return {
//                     ...state,
//                     current: `${constant()}`,
//                     overwrite: false,
//                 }
//             }
//             if (['+','-','×','÷','^'].includes(state.current.slice(-1))) {
//                 return {
//                     ...state,
//                     current: `${state.current} ${constant()}`,
//                 }
//             }
//             if (typeof parseInt(state.current.slice(-1)) === 'number') {
//                 return {
//                     ...state,
//                     current: `${state.current} × ${constant()}`
//                 }
//             }
//             // deal with if the user clicks unary then constant
//             return {}
//
//         // return {}
//         case 'get-answer':
//             if (state.answer === null) {
//                 return {
//                     ...state,
//                     answer: '0'
//                 }
//             }
//             if (state.overwrite) {
//                 return {
//                     ...state,
//                     current: state.answer,
//                     overwrite: false,
//                 }
//             }
//             if (['+','-','×','÷','^'].includes(state.current.slice(-1))) {
//                 return {
//                     ...state,
//                     current: `${state.current} ${state.answer}`,
//                 }
//             }
//             if (typeof parseInt(state.current.slice(-1)) === 'number') {
//                 return {
//                     ...state,
//                     current: `${state.current} × ${state.answer}`
//                 }
//             }
//             // deal with if the user clicks unary then answer
//             return {}
//
//         case 'evaluate':
//             if (state.current === null || '' || undefined) return state
//             let expr = state.current.slice()
//             let answer = useParser(expr)
//             return {
//                 ...state,
//                 answer: answer,
//                 addToHistory: `${state.current} = ${answer}`,
//                 overwrite: true,
//             }
//
//     }
// }
//
// const betweenParentheses = (current: string, value: string) => {
//     let indexLeft = current.lastIndexOf('(')
//     let indexRight = current.lastIndexOf(')')
//     return `${current.substring(0, indexLeft+1)} ${current.substring(indexLeft+1, indexRight-1)} ${value} )`
// }
//
// // TO DO figure out how to completely clear the main display without clearing history too
//
// const solveUnary = (expr: string) => {
//     unary.filter(func => expr.includes(func))
//         .forEach(func => {
//
//         })
//     // unary.forEach(func => {
//     //     let i = expr.indexOf(func)
//     //     if (i > -1) {
//     //         let [express, un] = expr.slice(i)
//     //
//     //     }
//     // })
// }
//
// const unary = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'log10', 'sqrt', 'abs', 'floor', 'ciel']
//
// const unaryFunctions = [
//     { 'sin':   (x: number) => Math.sin(x)   },
//     { 'cos':   (x: number) => Math.cos(x)   },
//     { 'tan':   (x: number) => Math.tan(x)   },
//     { 'asin':  (x: number) => Math.asin(x)  },
//     { 'acos':  (x: number) => Math.acos(x)  },
//     { 'atan':  (x: number) => Math.atan(x)  },
//     { 'log':   (x: number) => Math.log(x)   },
//     { 'log10': (x: number) => Math.log10(x) },
//     { 'sqrt':  (x: number) => Math.sqrt(x)  },
//     { 'abs':   (x: number) => Math.abs(x)   },
//     { 'floor': (x: number) => Math.floor(x) },
//     { 'ceil':  (x: number) => Math.ceil(x)  },
// ]
//
// const constants = {
//     'π':       () => Math.PI.toFixed(10),
//     'e':       () => Math.E.toFixed(10),
//     '0 ↔ 1':   () => Math.random().toFixed(3),
//     '1 ↔ 10':  () => Math.floor(Math.random() * 10 + 1),
//     '1 ↔ 100': () => Math.floor(Math.random() * 100 + 1),
// }
//
// const initHistory: string[] = []
//
// export const useCalculator = () => {
//     const [{current, addToHistory}, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, { current: null, answer: '0', addToHistory: null })
//     const [history, setHistory] = useState(initHistory)
//     const [display, setDisplay] = useState('')
//
//     useEffect(() => {
//         if (addToHistory === null) {
//             setHistory(initHistory)
//             return () => setHistory(initHistory)
//         }
//         setHistory([...history, addToHistory])
//         return () => setHistory([...history, addToHistory])
//     }, [addToHistory])
//
//     useEffect(() => {
//         setDisplay(current)
//         return () => setDisplay(current)
//     }, [current])
//
//
//     return {
//         dispatch,
//         display,
//         history,
//     }
// }
