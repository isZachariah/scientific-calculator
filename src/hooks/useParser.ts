
export const useParser = (expr: string) => {
    let queue: Token[] = []
    parse(expr, queue) //queue
    return  resolve(queue) //queue
}

const last = (stack: string[]) => stack[stack.length-1];

export const parse = (expr: string, queue: object[] ) => { //
    const stack: string[] = []
    expr.split(' ').forEach((token) => {
        if (/\d/.test(token)
            // || /^-\d+.\d+$/.test(token)
            || /^\d+.\d+$/.test(token)) {
            queue.push({type: 'number', value: parseFloat(token)})
        }
        if (token === '(') stack.push('(')
        if (token === ')') {
            while (last(stack) !== '(') {
                let el = getProperty(OPERATORS, stack.pop())
                queue.push({type: 'operation', value: stack.pop()})
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
                // while (prev.precedence > curr.precedence || prev.precedence === curr.precedence && prev.left) {
                //     queue.push({ type: 'operation', value: stack.pop() })
                //     if (stack.length === 0) break;
                // }

                while (greaterPrecedence(prev, curr) || equalPrecedence(prev, curr)) {
                    queue.push({ type: 'operation', value: stack.pop() })
                    if (stack.length === 0) break;
                }
            }
            stack.push(token)
        }
    });
    while (stack.length !== 0) {
        if (last(stack) === '(' || last(stack) === ')') stack.pop()
        // let el = getProperty(OPERATORS, stack.pop())
        queue.push({ type: 'operation', value: stack.pop() })
    }
}

const addToLocalStorage = (object: Token) => {
    let queue: Token[] = JSON.parse(localStorage.getItem('queue') as string)
    if (queue === null) queue = []
    queue.push(object)
    localStorage.setItem('queue', JSON.stringify(queue))
}


export type Token =
    { type: string;
        value: number | string
    }

export const resolve = (tokens: Token[]) => {
    let result = 0
    let stack: number[] = []
    tokens.forEach((element) => {
        switch (element.type) {
            case 'number':
                if (typeof element.value === 'number') stack.push(element.value);
                break;
            case 'operation':
                let b: number = stack.pop();
                let a: number = stack.pop();
                if (typeof element.value === "string") {
                    const operator = getProperty(OPERATORS, element.value)
                    result = operator.binaryFunction(a, b);
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

