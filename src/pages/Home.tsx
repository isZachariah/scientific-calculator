import {useCalculator} from "../hooks/useCalculator";
import {Calculator} from "../components/Calculator";
import {Tape} from "../components/Tape";
import {Header} from "../components/Header";
import {Footer} from "../components/Footer";
import Layout from "../components/Layout";
import React, {FC} from "react";
import App from "../App";

export const Home = () => {
    const { dispatch, display, history } = useCalculator()
    return (
        <>
            <Layout>
                {/*<App/>*/}
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
            </Layout>
        </>

    )
}


