import React, {useEffect, useReducer, useState} from "react";
import {reducer, State, Action} from "./reducer";

const initHistory: string[] = []
/**  useCalculator
 * Find reducer function in reducer.ts
 * This  function combines  useReducer,  useState, and useEffect to manage the state
 * of the calculator.
 * **/
export const useCalculator = () => {
    // @ts-ignore
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
