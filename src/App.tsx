import {ToggleSwitch} from "./components/ToggleSwitch";
import './App.css';
import {Calculator} from "./components/Calculator";
import {useReducer} from "react";
import {useCalculator} from "./hooks/useCalculator";
import {Display} from "./components/Display";
import {Tape} from "./components/Tape";




function App() {
  const { dispatch, current, history } = useCalculator()

  return (
    <div className={'w-screen h-screen max-w-full max-h-full dark:bg-zinc-400'}>
      <div>
        <header className={'w-screen h-1/5 flex flex-row m-auto justify-between '}>
            <h1 className="font-bold text-9xl text-white text-stroke-black text-stroke-2 m-3">
              <span>Calculator</span>
            </h1>
            <div className={'m-auto justify-self-end absolute right-4 top-12'}>
              <ToggleSwitch />
            </div>
        </header>
      </div>
      <div className={'m-auto p-12 flex flex-row'}>
          <Calculator dispatch={dispatch} current={current} />
          <Tape history={history} />
      </div>
    </div>
  )
}

export default App
