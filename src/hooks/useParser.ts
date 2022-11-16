import {Dispatch, useState} from "react";


const initQueue: Token[] = []
export const useParser = (expr: string) => {
    const [queue, setQueue] = useState(initQueue)
    parse(expr, queue, setQueue)
    return resolve(queue)
}

const last = (stack: string[]) => stack[stack.length-1];


// MOVE QUEUE TO BE A PART OF THE USEREDUCER STATE
export const parse = (expr: string, queue: object[], setQueue: Dispatch<Token[]>) => {

    console.log(expr)
    // const queue = []
    const stack: string[] = []
    expr.split(' ').forEach((token, index, arr) => {
        if (/\d/.test(token)
            || /^-\d+.\d+$/.test(token)
            || /^\d+.\d+$/.test(token)) setQueue([...queue, { type: 'number', value: parseFloat(token) } ])
        if (token === '(') stack.push('(')
        if (token === ')') {
            while (last(stack) !== '(') {
                let el = getProperty(OPERATORS, stack.pop())
                setQueue([...queue, { type: 'operation', el } ])
                // queue.push(stack.pop())
                if (stack.length <= 1 && stack[0] !== '(') {
                    throw new Error(`useParser: Mismatched Parens`)
                }
            }
            stack.pop()
        }
        if (token in OPERATORS) {
            if (stack.length !== 0) {
                let curr = getProperty(OPERATORS, token)
                let prev = getProperty(OPERATORS, last(stack))
                while (greaterPrecedence(prev, curr) || equalPrecedence(prev, curr)) {
                    setQueue([...queue, { type: 'operation', value: prev } ])
                    if (stack.length === 0) break;
                }
            }
            stack.push(token)
        }
    });
    while (stack.length !== 0) {
        if (last(stack) === '(' || last(stack) === ')') stack.pop()
        let el = getProperty(OPERATORS, stack.pop())
        setQueue([ ...queue , { type: 'operation', value: el }] )
        queue.push({ type: 'operation', value: el })
    }
}


export type Token = { type: string; value: number | { operation: string; binaryFunction: (x: number, y: number) => number; left: boolean; precedence: number; }; }
    // type: string
    // value: number | opNode



export const resolve = (tokens: Token[]) => {
    let result = 0
    let stack: number[] = []
    tokens.forEach((element) => {
        switch (element.type) {
            case 'number':
                if (typeof element.value === 'number') stack.push(element.value);
                break;
            case 'operation':
                let a = stack.pop();
                let b = stack.pop();
                if (typeof element.value !== "number") {
                    result = element.value.binaryFunction(a, b);
                }
                stack.push(result);
                break;
        }
    });
    return result.toString();
}

function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName]; // o[propertyName] is of type T[K]
}

/** get precedence
 * returns the numerical precedence of an operation or function
 **/
function getPrecedence(element: opNode) {
    return element.precedence;
}


const greaterPrecedence = (on_stack: opNode, new_el: opNode) => {
    return getPrecedence(on_stack) > getPrecedence(new_el);
}

const equalPrecedence = (on_stack: opNode, new_el: opNode) => {
    return getPrecedence(on_stack) === getPrecedence(new_el) && association(on_stack);
}

function association(element: opNode) {
    return element.left
}

type opNode =  {
    operation: string
    binaryFunction: ((x: number, y: number) => number)
    left: boolean
    precedence: number
}

const generateOperator= (operation: string,
                         binaryFunction: ((x: number, y: number) => number),
                         left: boolean,
                         precedence: number,
) => ({
    operation,
    binaryFunction,
    left,
    precedence
});


const OPERATORS = {
    '+': generateOperator('+', ((x, y) => x + y), true, 2),
    '−': generateOperator('−', ((x, y) => x - y), true, 2),
    '×': generateOperator('*', ((x, y) => x * y), true, 3),
    '÷': generateOperator('/', ((x, y) => x / y), true, 3),
    'mod': generateOperator('mod', ((x, y) => x % y), true, 3),
    '^': generateOperator('^', ((x, y) => Math.pow(y, x)), false, 1),
}

