
const constants = {
    pi: Math.PI,
    ln10: Math.LN10,
    ln2: Math.LN2,
    log2e: Math.LOG2E,
    log10e: Math.LOG10E,
    sqrt1_2: Math.SQRT1_2,
    sqrt2: Math.SQRT2,
    e: Math.E,
};

const types = {
    literal: 'number',
    constant: 'constant',
    identifier: 'identifier',
    operation: 'operator',
    function: 'functions',
    bracket: { left: 'left bracket', right: 'right bracket' },
};

const brackets = {
    left: '({[',
    right: ')}]'
}

/** operations and functions **/

/** Generate functions receives a clojure/ function, a type, a precedence, and a boolean and returns an object including each */

const generateFunction = (evaluate: Eval, operation: string, type = types.function, precedence = 0, left_assoc = true): opNode => ({
    evaluate,
    operation,
    type,
    precedence,
    left_assoc,
});

type Eval = ((x: number, y: number) => number) | ((x: number) => number)

type opNode =  {
    evaluate: ((x: number, y: number) => number) | ((x: number) => number)
    operation: string
    type: string
    precedence: number
    left_assoc: boolean
}
/** Unary Functions that take one parameter;
 * type = function; precedence = 0; associativity = left
 sin cos tan arcsin arccos arctan ln log sqrt abs round ceil
 */
const unary_functions = {
    sin:   generateFunction((x: number) => Math.sin(x), 'sin'),
    cos:   generateFunction((x: number) => Math.cos(x), 'cos'),
    tan:   generateFunction((x: number) => Math.tan(x), 'tan'),
    asin:  generateFunction((x: number) => Math.asin(x), 'asin'),
    acos:  generateFunction((x: number) => Math.acos(x), 'acos'),
    atan:  generateFunction((x: number) => Math.atan(x), 'atan'),
    ln:    generateFunction((x: number) => Math.log(x), 'ln'),
    log:   generateFunction((x: number) => Math.log10(x), 'log'),
    sqrt:  generateFunction((x: number) => Math.sqrt(x), 'sqrt'),
    abs:   generateFunction((x: number) => Math.abs(x), 'abs'),
    round: generateFunction((x: number) => Math.round(x), 'round'),
    floor: generateFunction((x: number) => Math.floor(x), 'floor'),
    ceil:  generateFunction((x: number) => Math.ceil(x), 'ceil'),
};

/** Binary functions take two parameters and vary in precedence and left association
 addition: + subtraction - multiplication: * division: / modulus: % power: ^ max min
 */
const binary_functions = {
    '+': generateFunction((x, y) => x + y, 'addition', types.operation, 2),
    '−': generateFunction((x, y) => x - y, 'subtraction',types.operation, 2),
    '×': generateFunction((x, y) => x * y, 'multiplication', types.operation, 3),
    '÷': generateFunction((x, y) => x / y, 'division', types.operation, 3),
    'mod': generateFunction((x, y) => x % y, 'modulus', types.operation, 3),
    '^': generateFunction((x, y) => Math.pow(y, x), 'power', types.operation,1, false),
    max: generateFunction((x, y) => Math.max(x, y), 'max'),
    min: generateFunction((x, y) => Math.min(x, y), 'min')
};

// Function and Operation Helpers

/** function not operation **/
const functionNotOperation = (func: opNode) => func.type === types.function;

/** is an operation or function
 * @param {string} token
 * @return {boolean} true if token is an operation or a function
 **/
function isOperationOrFunction(token: string) {
    return token in unary_functions || token in binary_functions;
}

/** find element
 * Takes in an element and checks if it is an operation or a function,
 * returning an object with the value
 *
 * @param {string} token
 * @returns {object}
 * */
function findElement(token: string) {
    if (token in unary_functions) return unary_functions[token]
    if (token in binary_functions) return binary_functions[token]
}

/** get precedence
 * returns the numerical precedence of an operation or function
 **/
function getPrecedence(element: opNode) {
    return element.precedence;
}

/** Takes in two operation (or function) objects - one from the stack and the newest
 * being tokenized, and returns a boolean depending upon which has greater precedence,
 * deciding if the on-stack operation should be popped off onto the queue or not.
 * @param {operation} on_stack
 * @param new_el
 * @return {boolean}
 * **/
const greaterPrecedence = (on_stack: opNode, new_el: opNode) => {
    return getPrecedence(on_stack) > getPrecedence(new_el);
}

/** Takes in two operation (or function) objects - one from the stack and the newest
 * being tokenized, and returns a boolean, because they have equal precedence,
 * if the on-stack is left associated it will be popped off onto the queue.
 * @param {operation} on_stack
 * @param new_el
 * @return {boolean}
 * **/
const equalPrecedence = (on_stack: opNode, new_el: opNode) => {
    return getPrecedence(on_stack) === getPrecedence(new_el) && association(on_stack);
}

/** association
 * @param {object} element
 * @returns {boolean} true if element is left associated false otherwise
 **/
function association(element) {
    return element.value in binary_functions ?
        binary_functions[element.value].left_assoc : true;
}

// Literal Value and Constant Helpers

/** isNumber
 * @param {string} token
 * @return {boolean} true if token is a digit, a decimal, or a constant
 **/
function isNumber(token: string) {
    return /\d/.test(token) || token === '.' || token in constants;
}

/** literal value
 * @param {string} token
 * @return {object} { type, value }
 **/
function literalValue(token: string) {
    return {
        type: types.literal,
        value: parseFloat(token)
    }
}


// Parsing and Evaluation helpers
const last = (stack: opNode[] | string) => stack[stack.length-1];

type Element = {
    type: string,
    value: number | opNode
}

/** parser
 * This function takes a prefix expression in the form of a string array  as an argument,
 * transforms it into a postfix expression with additional information for each token,
 * and returns an object array.
 * @param {string[]} expression
 * @return {object[]}
 **/
function parse(expression: string[]) {
    const queue = [];
    const stack: string[] = [];

    expression.forEach((token, index, array) => {
        if (/^-?\d*\.{0,1}\d+$/.test(token)) {
            queue.push({type: types.literal, value: parseFloat(token)});
        }
        else if (token === 'random') {
            queue.push({type: types.literal, value: Math.random()});
        }
        else if (brackets.left.includes(token)) {
            stack.push('(');
        }
        else if (brackets.right.includes(token)) {
            // @ts-ignore
            while (last(stack) !== '(') {
                queue.push(stack.pop());
                // if (stack.length <= 1 && stack[0] !== '(') {
                //     throw new Error('Mismatched Parentheses');
                // }
            }
            stack.pop();
        }
        else if (isOperationOrFunction(token)) {
            let element = findElement(token);
            if (element.type === types.function) stack.push(element);
            else {
                if (stack.length !== 0) {
                    // @ts-ignore
                    while (functionNotOperation(last(stack)) ||
                    // @ts-ignore
                    greaterPrecedence(last(stack), element) ||
                    // @ts-ignore
                    equalPrecedence(last(stack), element)) {
                        queue.push(stack.pop());
                        if (stack.length === 0) break;
                    }
                }
                stack.push(element);
            }
        }
        // else throw Error('Token not recognized');
    });
    while (stack.length !== 0) {
        // @ts-ignore
        if (last(stack) === '(' || last(stack) === ')') stack.pop();
        queue.push(stack.pop())
    }
    return queue
}

/** evaluate
 * This function receives the parsed tokens from parse(), iterates through the postfix expression
 * and derives a result based on the input operands and operations
 * @param {object[]} tokens
 * @return {number}
 **/
function evaluate(tokens: any[]) {
    console.log(tokens)
    let result = 0;
    let stack: number[] = [];
    tokens.forEach((element, index, array) => {
        console.log(element)
        if (element === undefined) return;
        switch (element.type) {
            case types.constant:
                stack.push(element.value);
                break;
            case types.literal:
                stack.push(element.value);
                break;
            case types.function:
                result = element.evaluate(stack.pop());
                stack.push(result);
                break;
            case types.operation:
                let b = stack.pop();
                let a = stack.pop();
                result = element.evaluate(a, b);
                stack.push(result);
                break;
        }
    });
    console.log(result)
    return result;
}

export const solve = (expression: string[]) => {
    let tokens = parse(Array.from(expression))
    return evaluate(tokens)
}


