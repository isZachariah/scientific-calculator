


interface TapeProps {
    history: string[]
    dispatch: (p: {type: string, payload: { value: string }}) => void
}




export const Tape = ({history, dispatch}: TapeProps) => {

    return (
        <div className={'p-2 border-black border-2 rounded-xl dark:border-[#93b7be] '}>
            <div className={'bg-[#f1fffa] dark:bg-[#00798c] flex flex-col h-fit rounded-xl mx-auto m-0 p-3 text-2xl text-black overflow-x-auto x-scroll'}>
                {
                    history.map((newCalculation: string, index: number ) => {
                        let [calculation, answer] = newCalculation.split(' = ')
                        console.log(calculation)
                        console.log(answer)
                        return (
                            <div key={index} className={'flex flex-col'}>
                                <div
                                    className={'flex flex-row'}>
                                    <p className={'flex hover:border-2 h-12 hover:border-[#93b7be] max-w-xs hover:rounded-xl px-2 cursor-pointer overflow-x-hidden overflow-x-scroll overflow-hidden whitespace-nowrap'}
                                       onClick={() => {
                                           dispatch({
                                               type: 'retrieve-history',
                                               payload: {value: `${calculation}`}
                                           })
                                       }}

                                    >{calculation}</p>
                                    <p className={'gap-1 px-3'}>=</p>
                                    <p  className={'hover:border-2 hover:border-[#93b7be] hover:rounded-xl px-2 cursor-pointer max-w-xs overflow-x-hidden overflow-x-scroll overflow-hidden whitespace-nowrap'}
                                        onClick={() => {
                                            dispatch({
                                                type: 'retrieve-history',
                                                payload: {value: `${answer}`}
                                            })
                                        }}

                                    >{answer}</p>
                                </div>
                                <div className={'bg-black h-0 w-full'}/>
                            </div>
                        )
                    })
                }
            </div>
        </div>

    )
}