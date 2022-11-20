import {ToggleSwitch} from "./components/ToggleSwitch";
import './App.css';
import {Calculator} from "./components/Calculator";
import {useCalculator} from "./hooks/useCalculator";
import {Tape} from "./components/Tape";




function App() {
  const { dispatch, display, history } = useCalculator()

  return (
    <div className={'w-screen h-screen max-w-full max-h-full dark:bg-slate-800 dark:text-white bg-slate-200'}>
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
      <div className={'m-0 px-32 flex flex-row flex-auto flex-wrap justify-center align-middle'}>
          <div className={'w-1/2'}>
              <Calculator dispatch={dispatch} current={display} />
          </div>
          <div className={'w-1/2'}>
              <Tape history={history} dispatch={dispatch}/>
          </div>

      </div>
    </div>
  )
}

export default App
