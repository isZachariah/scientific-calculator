import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import { Link, Routes, Route } from "react-router-dom";
import { useReducer, useState, useEffect } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";
const types = {
  literal: "number",
  constant: "constant",
  identifier: "identifier",
  operation: "operator",
  function: "functions",
  bracket: { left: "left bracket", right: "right bracket" }
};
const brackets = {
  left: "({[",
  right: ")}]"
};
const generateFunction = (evaluate2, operation, type = types.function, precedence = 0, left_assoc = true) => ({
  evaluate: evaluate2,
  operation,
  type,
  precedence,
  left_assoc
});
const unary_functions = {
  sin: generateFunction((x) => Math.sin(x), "sin"),
  cos: generateFunction((x) => Math.cos(x), "cos"),
  tan: generateFunction((x) => Math.tan(x), "tan"),
  asin: generateFunction((x) => Math.asin(x), "asin"),
  acos: generateFunction((x) => Math.acos(x), "acos"),
  atan: generateFunction((x) => Math.atan(x), "atan"),
  ln: generateFunction((x) => Math.log(x), "ln"),
  log: generateFunction((x) => Math.log10(x), "log"),
  sqrt: generateFunction((x) => Math.sqrt(x), "sqrt"),
  abs: generateFunction((x) => Math.abs(x), "abs"),
  round: generateFunction((x) => Math.round(x), "round"),
  floor: generateFunction((x) => Math.floor(x), "floor"),
  ceil: generateFunction((x) => Math.ceil(x), "ceil")
};
const binary_functions = {
  "+": generateFunction((x, y) => x + y, "addition", types.operation, 2),
  "\u2212": generateFunction((x, y) => x - y, "subtraction", types.operation, 2),
  "\xD7": generateFunction((x, y) => x * y, "multiplication", types.operation, 3),
  "\xF7": generateFunction((x, y) => x / y, "division", types.operation, 3),
  "mod": generateFunction((x, y) => x % y, "modulus", types.operation, 3),
  "^": generateFunction((x, y) => Math.pow(y, x), "power", types.operation, 1, false),
  max: generateFunction((x, y) => Math.max(x, y), "max"),
  min: generateFunction((x, y) => Math.min(x, y), "min")
};
const functionNotOperation = (func) => func.type === types.function;
function isOperationOrFunction(token) {
  return token in unary_functions || token in binary_functions;
}
function findElement(token) {
  if (token in unary_functions)
    return unary_functions[token];
  if (token in binary_functions)
    return binary_functions[token];
}
function getPrecedence(element) {
  return element.precedence;
}
const greaterPrecedence = (on_stack, new_el) => {
  return getPrecedence(on_stack) > getPrecedence(new_el);
};
const equalPrecedence = (on_stack, new_el) => {
  return getPrecedence(on_stack) === getPrecedence(new_el) && association(on_stack);
};
function association(element) {
  return element.value in binary_functions ? binary_functions[element.value].left_assoc : true;
}
const last = (stack) => stack[stack.length - 1];
function parse(expression) {
  const queue = [];
  const stack = [];
  expression.forEach((token, index, array) => {
    if (/^-?\d*\.{0,1}\d+$/.test(token)) {
      queue.push({ type: types.literal, value: parseFloat(token) });
    } else if (token === "random") {
      queue.push({ type: types.literal, value: Math.random() });
    } else if (brackets.left.includes(token)) {
      stack.push("(");
    } else if (brackets.right.includes(token)) {
      while (last(stack) !== "(") {
        queue.push(stack.pop());
      }
      stack.pop();
    } else if (isOperationOrFunction(token)) {
      let element = findElement(token);
      if (element.type === types.function)
        stack.push(element);
      else {
        if (stack.length !== 0) {
          while (functionNotOperation(last(stack)) || greaterPrecedence(last(stack), element) || equalPrecedence(last(stack), element)) {
            queue.push(stack.pop());
            if (stack.length === 0)
              break;
          }
        }
        stack.push(element);
      }
    }
  });
  while (stack.length !== 0) {
    if (last(stack) === "(" || last(stack) === ")")
      stack.pop();
    queue.push(stack.pop());
  }
  return queue;
}
function evaluate(tokens) {
  console.log(tokens);
  let result = 0;
  let stack = [];
  tokens.forEach((element, index, array) => {
    console.log(element);
    if (element === void 0)
      return;
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
  console.log(result);
  return result;
}
const solve = (expression) => {
  let tokens = parse(Array.from(expression));
  return evaluate(tokens);
};
String.prototype.replaceAt = function(index, replacement) {
  if (index >= this.length) {
    return this.valueOf();
  }
  return this.substring(0, index) + replacement + this.substring(index + 1);
};
const reducer = (state, { type, payload }) => {
  switch (type) {
    case "add-digit":
      if (state.overwrite) {
        if (payload.value === ".")
          return overwrite("0.", state);
        return overwrite(payload.value, state);
      }
      return addValue(state.current, payload.value, state);
    case "delete":
      if (state.overwrite)
        return { ...state, overwrite: true, current: null };
      if (state.current === null)
        return state;
      if (state.current.length === 1)
        return { ...state, current: null, overwrite: true };
      if (lastIsAlpha(state.current)) {
        let i = 1;
        while (lastIsAlpha(state.current.slice(0, -i))) {
          i++;
        }
        return { ...state, current: state.current.slice(0, -i) };
      }
      return {
        ...state,
        current: state.current.slice(0, -1)
      };
    case "clear":
      if (state.current === null) {
        return {
          ...state,
          overwrite: true,
          current: null,
          addToHistory: null,
          answer: "0"
        };
      }
      return {
        ...state,
        current: null,
        overwrite: true
      };
    case "choose-operator":
      if (state.overwrite)
        return state;
      if (state.current === null)
        return state;
      return addValue(state.current, payload.value, state);
    case "left-parens":
      if (state.overwrite || state.current === null) {
        return { ...state, current: "(", overwrite: false };
      }
      return addValue(state.current, payload.value, state);
    case "right-parens":
      if (state.overwrite)
        return state;
      return addValue(state.current, payload.value, state);
    case "percent":
      if (state.overwrite)
        return state;
      if (isDigit(state.current))
        return { ...state, current: `${parseFloat(state.current) / 100}` };
      return state;
    case "negate":
      if (state.overwrite)
        return state;
      if (isDigit(state.current))
        return negate(state.current, state);
      return state;
    case "unary-function":
      if (state.overwrite)
        return overwrite(payload.value, state);
      if (isDecimal(state.current) && payload.value === "floor" || isDecimal(state.current) && payload.value === "ceil") {
        if (payload.value === "ceil") {
          let answer = Math.ceil(parseFloat(state.current));
          return {
            ...state,
            current: `${answer}`,
            answer: `${answer}`,
            addToHistory: `ceil ${state.current} = ${answer}`
          };
        }
        if (payload.value === "floor") {
          let answer = Math.floor(parseFloat(state.current));
          return {
            ...state,
            current: `${answer}`,
            answer: `${answer}`,
            addToHistory: `floor ${state.current} = ${answer}`
          };
        }
      }
      return addValue(state.current, payload.value, state);
    case "constant":
      let constant = constants$1[payload.value]();
      if (state.overwrite)
        return overwrite(constant, state);
      return addValue(state.current, constant, state, true);
    case "get-answer":
      if (state.overwrite)
        return overwrite(state.answer, state);
      return addValue(state.current, state.answer, state, true);
    case "retrieve-history":
      if (state.overwrite)
        return overwrite(payload.value, state);
      return addValue(state.current, payload.value, state, true);
    case "evaluate":
      console.log(state);
      if (state.overwrite)
        return state;
      if (isDigit(state.current))
        return { ...state, overwrite: true, current: "", addToHistory: `${state.current} = ${state.current}` };
      if (!/\d/.test(state.current))
        return { ...state, overwrite: true, addToHistory: `${state.current} = Error`, current: "Error: No digits in expression" };
      if (/[(]/.test(state.current) || /[)]/.test(state.current)) {
        let countLeftParentheses = state.current.split("(").length - 1;
        let countRightParentheses = state.current.split(")").length - 1;
        if (countLeftParentheses !== countRightParentheses) {
          return {
            ...state,
            overwrite: true,
            addToHistory: `${state.current} = Error`,
            current: "Error: Parentheses do not match"
          };
        }
        return getAnswer(state);
      }
      return getAnswer(state);
    default:
      return state;
  }
};
const getAnswer = (state) => {
  let expr = state.current.split(" ");
  let answer = solve(expr);
  if (isNaN(answer))
    return { ...state, answer: 0, addToHistory: `${state.current} = Error`, overwrite: true };
  return {
    ...state,
    answer,
    current: "",
    addToHistory: `${state.current} = ${answer}`,
    overwrite: true
  };
};
const overwrite = (value, state) => {
  return {
    ...state,
    current: `${value}`,
    overwrite: false
  };
};
const negate = (expr, state) => {
  if (parseFloat(expr) > 0) {
    return {
      ...state,
      current: `-${parseFloat(expr)}`
    };
  }
  if (parseFloat(expr) < 0) {
    return {
      ...state,
      current: `${Math.abs(parseFloat(expr))}`
    };
  }
};
const isDecimal = (value) => /^-?\d*\.\d+$/.test(value);
const isDigit = (value) => /^-?\d*\.{0,1}\d+$/.test(value);
const lastIsDigit = (expr) => /^\d*\.?\d*$/.test(expr.slice(-1));
const lastIsRightParentheses = (expr) => /[)]/.test(expr.slice(-1));
const lastIsLeftParentheses = (expr) => /[(]/.test(expr.slice(-1));
const lastIsOperator = (expr) => ["+", "\u2212", "\xD7", "\xF7", "^"].includes(expr.slice(-1)) || ["mod"].includes(expr.slice(-3));
const lastIsAlpha = (expr) => /[a-z]/.test(expr.slice(-1));
const lastIsAlphaOrOperator = (expr) => lastIsOperator(expr) || lastIsAlpha(expr) || lastIsLeftParentheses(expr);
const addValue = (expr, value, state, retrievedValue = false) => {
  if (retrievedValue) {
    if (lastIsAlphaOrOperator(expr))
      return { ...state, current: `${expr} ${value}` };
    if (lastIsRightParentheses(expr) || lastIsDigit(expr)) {
      return { ...state, current: `${expr} \xD7 ${value}` };
    }
  }
  if (lastIsDigit(value)) {
    if (expr === "0" && value === "0")
      return state;
    if (expr === "" && value === ".")
      return { ...state, current: `0.` };
    if (expr === "0" && value !== ".")
      return { ...state, current: value };
    if (value === "." && expr.includes("."))
      return state;
    if (lastIsDigit(expr))
      return { ...state, current: `${expr}${value}` };
    if (lastIsAlphaOrOperator(expr))
      return { ...state, current: `${expr} ${value}` };
    if (lastIsRightParentheses(expr))
      return { ...state, current: `${expr} \xD7 ${value}` };
    return {
      ...state,
      current: `${state.current || ""}${value}`
    };
  }
  if (lastIsOperator(value)) {
    if (lastIsAlphaOrOperator(expr))
      return state;
    if (lastIsDigit(expr) || lastIsRightParentheses(expr)) {
      return { ...state, current: `${expr} ${value}` };
    }
  }
  if (lastIsAlpha(value)) {
    if (lastIsAlpha(expr))
      return state;
    if (lastIsDigit(expr) || lastIsRightParentheses(expr))
      return { ...state, current: `${expr} \xD7 ${value}` };
    return { ...state, current: `${expr} ${value}` };
  }
  if (lastIsLeftParentheses(value)) {
    if (lastIsAlphaOrOperator(state.current.slice(-1))) {
      return { ...state, parentheses: true, current: `${state.current} ${value}` };
    }
    if (isDigit(state.current.slice(-1)) || lastIsRightParentheses(expr)) {
      return { ...state, parentheses: true, current: `${state.current} \xD7 ${value}` };
    }
  }
  if (lastIsRightParentheses(value)) {
    if (lastIsAlphaOrOperator(expr))
      return state;
    if (lastIsDigit(expr))
      return { ...state, current: `${state.current} ${value}`, parentheses: false };
  }
};
const constants$1 = {
  "\u03C0": () => Math.PI.toFixed(10),
  "e": () => Math.E.toFixed(10),
  "0 \u2194 1": () => Math.random().toFixed(3),
  "1 \u2194 10": () => Math.floor(Math.random() * 10 + 1),
  "1 \u2194 100": () => Math.floor(Math.random() * 100 + 1)
};
const initHistory = [];
const useCalculator = () => {
  const [{ current, addToHistory }, dispatch] = useReducer(reducer, { current: "", answer: "0", addToHistory: null, overwrite: true });
  const [history, setHistory] = useState(initHistory);
  const [display, setDisplay] = useState("");
  useEffect(() => {
    if (addToHistory === null) {
      setHistory(initHistory);
      return () => setHistory(initHistory);
    }
    setHistory([...history, addToHistory]);
    return () => setHistory([...history, addToHistory]);
  }, [addToHistory]);
  useEffect(() => {
    setDisplay(current);
    return () => setDisplay(current);
  }, [current]);
  return {
    dispatch,
    display,
    history
  };
};
const Fragment = jsxRuntime.Fragment;
const jsx = jsxRuntime.jsx;
const jsxs = jsxRuntime.jsxs;
const Button = ({
  dispatch,
  type,
  value,
  style,
  outline = true
}) => {
  return /* @__PURE__ */ jsx("div", {
    className: "select-none",
    onClick: () => dispatch({
      type,
      payload: {
        value
      }
    }),
    children: outline ? /* @__PURE__ */ jsx("span", {
      className: "w-full h-full select-none" + style,
      children: value
    }) : /* @__PURE__ */ jsx("div", {
      className: "w-full h-full select-none" + style,
      children: value
    })
  });
};
const Display = ({
  dispatch,
  current
}) => {
  return /* @__PURE__ */ jsxs("div", {
    className: "min-w-full max-w-sm border-black border border-2 dark:border-0 dark:border-b-2 p-3 flex flex-row h-24 bg-white dark:bg-[#00798c] align-middle rounded-t-xl",
    children: [/* @__PURE__ */ jsx("span", {
      className: "font-bold text-4xl text-white text-stroke-black text-stroke-2 w-5/6 h-20 text-end align-middle m-auto break-all overflow-y-scroll",
      children: current
    }), /* @__PURE__ */ jsx(Button, {
      dispatch,
      type: "delete",
      value: "\u232B",
      style: "font-bold text-4xl text-black hover:text-[#00798c] dark:hover:text-[#ff798c] text-stroke-black text-stroke-2 m-0 cursor-pointer relative right-1 align-middle m-auto",
      outline: false
    })]
  });
};
const ButtonGroup = ({
  dispatch,
  style,
  buttons: buttons2,
  outline = true
}) => {
  return /* @__PURE__ */ jsx("div", {
    className: style,
    children: buttons2.map((btn, index) => /* @__PURE__ */ jsx(Button, {
      dispatch,
      type: btn.type,
      value: btn.value,
      style: btn.style,
      outline
    }, index))
  });
};
const Calculator = ({
  dispatch,
  current
}) => {
  const [inverse, setInverse] = useState(false);
  return /* @__PURE__ */ jsx("div", {
    className: "w-fit flex-none flex-wrap flex flex-row p-2 border-black border-2 rounded-xl dark:border-[#93b7be]",
    children: /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col min-w-lg min-w-sm dark:bg-[#00798c] rounded-xl",
      children: [/* @__PURE__ */ jsx(Display, {
        dispatch,
        current
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex flex-row py-3 h-96",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "pr-5 w-32",
          children: [/* @__PURE__ */ jsx("button", {
            onClick: () => setInverse(!inverse),
            className: "border border-black border-2 px-5 ml-5 rounded-xl text-2xl hover:bg-[#ff798c]",
            children: inverse ? "\u2190" : "\u2192"
          }), /* @__PURE__ */ jsx("div", {
            children: !inverse && /* @__PURE__ */ jsx(ButtonGroup, {
              dispatch,
              style: "flex flex-row gap-10 px-4 pt-2",
              buttons: parens,
              outline: false
            })
          }), /* @__PURE__ */ jsx(ButtonGroup, {
            dispatch,
            style: "flex flex-col m-3 ",
            buttons: inverse ? inverseUnaryFunctions : unaryFunctions,
            outline: false
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "border border-black w-0"
        }), /* @__PURE__ */ jsx(ButtonGroup, {
          dispatch,
          style: "grid grid-cols-4 m-3 min-w-fit ",
          buttons,
          outline: true
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "border border-black h-0"
      }), /* @__PURE__ */ jsx(ButtonGroup, {
        dispatch,
        style: "flex flex-row m-3 gap-5",
        buttons: constants,
        outline: false
      })]
    })
  });
};
const buttonStyles = "font-bold text-6xl text-white text-stroke-black text-stroke-2 m-1 cursor-pointer hover:text-slate-400 ";
const digitStyle = "font-bold text-6xl text-white text-stroke-black text-stroke-2 m-1 cursor-pointer hover:text-pink-200 ";
const opStyles = "font-bold text-6xl text-white text-stroke-black text-stroke-2 m-1 cursor-pointer hover:text-slate-600";
const funcStyles = "font-bold text-4xl text-black text-stroke-black text-stroke-2 m-0 cursor-pointer hover:text-[#ff798c] ";
const constantStyles = "font-bold text-2xl text-black  m-1 hover:text-[#00798c] dark:hover:text-[#ff798c] cursor-pointer";
const buttons = [{
  type: "clear",
  value: "C",
  style: buttonStyles
}, {
  type: "negate",
  value: "\xB1",
  style: buttonStyles
}, {
  type: "percent",
  value: "%",
  style: buttonStyles
}, {
  type: "choose-operator",
  value: "^",
  style: opStyles
}, {
  type: "add-digit",
  value: "1",
  style: digitStyle
}, {
  type: "add-digit",
  value: "2",
  style: digitStyle
}, {
  type: "add-digit",
  value: "3",
  style: digitStyle
}, {
  type: "choose-operator",
  value: "\xF7",
  style: opStyles
}, {
  type: "add-digit",
  value: "4",
  style: digitStyle
}, {
  type: "add-digit",
  value: "5",
  style: digitStyle
}, {
  type: "add-digit",
  value: "6",
  style: digitStyle
}, {
  type: "choose-operator",
  value: "\xD7",
  style: opStyles
}, {
  type: "add-digit",
  value: "7",
  style: digitStyle
}, {
  type: "add-digit",
  value: "8",
  style: digitStyle
}, {
  type: "add-digit",
  value: "9",
  style: digitStyle
}, {
  type: "choose-operator",
  value: "\u2212",
  style: opStyles
}, {
  type: "add-digit",
  value: "0",
  style: digitStyle
}, {
  type: "add-digit",
  value: ".",
  style: digitStyle
}, {
  type: "evaluate",
  value: "=",
  style: "font-bold text-6xl text-red text-stroke-black dark:text-stroke-white text-stroke-2 m-3 cursor-pointer hover:text-white dark:hover:text-black"
}, {
  type: "choose-operator",
  value: "+",
  style: opStyles
}];
const unaryFunctions = [{
  type: "get-answer",
  value: "ans",
  style: funcStyles
}, {
  type: "choose-operator",
  value: "mod",
  style: funcStyles
}, {
  type: "unary-function",
  value: "ln",
  style: funcStyles
}, {
  type: "unary-function",
  value: "sqrt",
  style: funcStyles
}, {
  type: "unary-function",
  value: "ceil",
  style: funcStyles
}, {
  type: "unary-function",
  value: "floor",
  style: funcStyles
}];
const inverseUnaryFunctions = [{
  type: "unary-function",
  value: "sin",
  style: funcStyles
}, {
  type: "unary-function",
  value: "cos",
  style: funcStyles
}, {
  type: "unary-function",
  value: "tan",
  style: funcStyles
}, {
  type: "unary-function",
  value: "asin",
  style: funcStyles
}, {
  type: "unary-function",
  value: "acos",
  style: funcStyles
}, {
  type: "unary-function",
  value: "atan",
  style: funcStyles
}, {
  type: "unary-function",
  value: "log",
  style: funcStyles
}];
const parens = [{
  type: "left-parens",
  value: "(",
  style: funcStyles
}, {
  type: "right-parens",
  value: ")",
  style: funcStyles
}];
const constants = [{
  type: "constant",
  value: "e",
  style: constantStyles
}, {
  type: "constant",
  value: "\u03C0",
  style: constantStyles
}, {
  type: "constant",
  value: "0 \u2194 1",
  style: constantStyles
}, {
  type: "constant",
  value: "1 \u2194 10",
  style: constantStyles
}, {
  type: "constant",
  value: "1 \u2194 100",
  style: constantStyles
}];
const Tape = ({
  history,
  dispatch
}) => {
  return /* @__PURE__ */ jsx("div", {
    className: "p-2 border-black border-2 rounded-xl dark:border-[#93b7be] ",
    children: /* @__PURE__ */ jsx("div", {
      className: "bg-[#f1fffa] dark:bg-[#00798c] flex flex-col h-fit rounded-xl mx-auto m-0 p-3 text-2xl text-black overflow-x-auto x-scroll",
      children: history.map((newCalculation, index) => {
        let [calculation, answer] = newCalculation.split(" = ");
        console.log(calculation);
        console.log(answer);
        return /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex flex-row",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex hover:border-2 h-12 hover:border-[#93b7be] max-w-xs hover:rounded-xl px-2 cursor-pointer overflow-x-hidden overflow-x-scroll overflow-hidden whitespace-nowrap",
              onClick: () => {
                dispatch({
                  type: "retrieve-history",
                  payload: {
                    value: `${calculation}`
                  }
                });
              },
              children: calculation
            }), /* @__PURE__ */ jsx("p", {
              className: "gap-1 px-3",
              children: "="
            }), /* @__PURE__ */ jsx("div", {
              className: "hover:border-2 hover:border-[#93b7be] hover:rounded-xl px-2 cursor-pointer max-w-xs overflow-x-hidden overflow-x-scroll overflow-hidden whitespace-nowrap",
              onClick: () => {
                dispatch({
                  type: "retrieve-history",
                  payload: {
                    value: `${answer}`
                  }
                });
              },
              children: answer
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "bg-black h-0 w-full"
          })]
        }, index);
      })
    })
  });
};
function useDarkTheme() {
  const [theme, setTheme] = useState(localStorage.theme);
  const colorTheme = theme === "dark" ? "light" : "dark";
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(colorTheme);
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, colorTheme]);
  return [colorTheme, setTheme];
}
const ToggleSwitch = () => {
  const [colorTheme, setTheme] = useDarkTheme();
  const [darkTheme, setDarkTheme] = useState(colorTheme === "light");
  const toggleDarkMode = (checked) => {
    setTheme(colorTheme);
    setDarkTheme(checked);
  };
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsxs("label", {
      children: [/* @__PURE__ */ jsx("input", {
        type: "checkbox",
        className: "absolute left-1/2 -translate-x-1/2 peer appearance-none rounded-md",
        checked: darkTheme,
        onChange: () => toggleDarkMode(!darkTheme)
      }), /* @__PURE__ */ jsx("span", {
        className: `w-16 h-7 flex items-center flex-shrink-0 ml-4 p-1 bg-slate-300 rounded-full
                    duration-300 ease-in-out peer-checked:bg-[#ff798c] after:w-8 after:h-8 after:bg-white after:border-black after:border-2
                    after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6
                    group-hover:after:translate-x-1 border-black border-2`
      })]
    })
  });
};
const Header = () => {
  return /* @__PURE__ */ jsx("div", {
    className: "w-screen max-w-full max-h-full dark:bg-slate-800 dark:text-white bg-slate-200",
    children: /* @__PURE__ */ jsxs("header", {
      className: "w-screen h-1/5 flex flex-row m-auto justify-between ",
      children: [/* @__PURE__ */ jsx(Link, {
        to: "/",
        children: /* @__PURE__ */ jsx("span", {
          className: "font-bold text-9xl text-white text-stroke-black text-stroke-2 m-3",
          children: "Calculator"
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "flex flex-row m-auto justify-self-end absolute right-4 top-12 gap-12",
        children: /* @__PURE__ */ jsx(ToggleSwitch, {})
      })]
    })
  });
};
const Footer = () => {
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx("div", {
      className: "absolute flex flex-row gap-12 bottom-0 right-12 dark:bg-slate-800 dark:text-white bg-slate-200",
      children: /* @__PURE__ */ jsx(Link, {
        to: "/about",
        children: /* @__PURE__ */ jsx("span", {
          className: "text-white text-7xl",
          children: "\u203D"
        })
      })
    })
  });
};
const Layout = ({
  children
}) => {
  return /* @__PURE__ */ jsxs("div", {
    className: "w-screen h-screen max-w-full max-h-full dark:bg-slate-800 dark:text-white bg-slate-200",
    children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsx("div", {
      children
    }), /* @__PURE__ */ jsx(Footer, {})]
  });
};
const Home = () => {
  const {
    dispatch,
    display,
    history
  } = useCalculator();
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx(Layout, {
      children: /* @__PURE__ */ jsx("div", {
        className: "w-screen  h-screen max-w-full max-h-full  mt-4 dark:bg-slate-800 dark:text-white bg-slate-200",
        children: /* @__PURE__ */ jsxs("div", {
          className: "m-0 px-32 flex flex-row flex-auto flex-wrap justify-center align-middle",
          children: [/* @__PURE__ */ jsx("div", {
            className: "w-1/2",
            children: /* @__PURE__ */ jsx(Calculator, {
              dispatch,
              current: display
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "w-1/2",
            children: /* @__PURE__ */ jsx(Tape, {
              history,
              dispatch
            })
          })]
        })
      })
    })
  });
};
const About = () => {
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx(Layout, {
      children: /* @__PURE__ */ jsx("div", {
        className: "flex justify-center m-auto w-screen align-middle pt-12",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col w-1/3 justify-center align-middle m-auto text-center",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "justify-center align-middle m-auto gap-4 flex flex-col",
            children: [/* @__PURE__ */ jsx("p", {
              className: "text-2xl",
              children: "Project made by Zachariah Angus Magee"
            }), /* @__PURE__ */ jsx("p", {
              className: "font-bold italic",
              children: "Created with TypeScript, React, Vite, and Tailwindcss."
            }), /* @__PURE__ */ jsx("p", {
              className: "italic",
              children: "I also have experience building mobile apps with Kotlin and Java. I enjoy programming with other languages as well, including Python, Rust, and Go."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex flex-row gap-28 pt-36 text-center align-middle justify-center",
            children: [/* @__PURE__ */ jsx("a", {
              className: "font-9xl",
              href: "https://github.com/isZachariah",
              children: /* @__PURE__ */ jsx(FontAwesomeIcon, {
                style: {
                  fontSize: "5rem",
                  color: "#ADD8E6"
                },
                icon: faGithub
              })
            }), /* @__PURE__ */ jsx("a", {
              className: "",
              href: "https://www.linkedin.com/in/zachariahmagee/",
              children: /* @__PURE__ */ jsx(FontAwesomeIcon, {
                style: {
                  fontSize: "5rem",
                  color: "#ADD8E6"
                },
                icon: faLinkedin
              })
            }), /* @__PURE__ */ jsx("a", {
              className: "",
              href: "https://www.youtube.com/channel/UCx7PcDWz1RQ8T-cUwPpLgbg",
              children: /* @__PURE__ */ jsx(FontAwesomeIcon, {
                style: {
                  fontSize: "5rem",
                  color: "#ADD8E6"
                },
                icon: faYoutube
              })
            })]
          })]
        })
      })
    })
  });
};
const NotFound = () => {
  return /* @__PURE__ */ jsx(Layout, {
    children: /* @__PURE__ */ jsx("div", {
      className: "flex justify-center m-auto w-screen align-middle",
      children: /* @__PURE__ */ jsx("span", {
        className: "text-9xl",
        children: "404 Page Not Found!"
      })
    })
  });
};
const Router = () => {
  return /* @__PURE__ */ jsxs(Routes, {
    children: [/* @__PURE__ */ jsx(Route, {
      index: true,
      element: /* @__PURE__ */ jsx(Home, {})
    }), /* @__PURE__ */ jsx(Route, {
      path: "/about",
      element: /* @__PURE__ */ jsx(About, {})
    }), /* @__PURE__ */ jsx(Route, {
      path: "*",
      element: /* @__PURE__ */ jsx(NotFound, {})
    })]
  });
};
const render = ({
  path
}) => {
  return ReactDOMServer.renderToString(/* @__PURE__ */ jsx(StaticRouter, {
    location: path,
    children: /* @__PURE__ */ jsx(Router, {})
  }));
};
export {
  render
};
