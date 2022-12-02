import { Route, Routes, Link} from "react-router-dom";
import {ToggleSwitch} from "./components/ToggleSwitch";
import {Calculator} from "./components/Calculator";
import {useCalculator} from "./hooks/useCalculator";
import {Tape} from "./components/Tape";
import './App.css';
import Layout from "./components/Layout";
import React from "react";


function App(): React.ReactElement {
    const { dispatch, display, history } = useCalculator()


  return (
      <div className={'w-screen  h-screen max-w-full max-h-full  mt-4 dark:bg-slate-800 dark:text-white bg-slate-200'}>
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
