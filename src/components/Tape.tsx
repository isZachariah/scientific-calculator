


interface TapeProps {
    history: string[]
}




export const Tape = ({history}: TapeProps) => {

    return (
        <div className={'bg-[#f1fffa] dark:bg-[#00798c] flex flex-col w-1/3 h-2/3 rounded-xl mx-auto mt-14 text-2xl text-black'}>
            {
                history.map((newCalculation, index ) => {
                    return (
                        <p key={index}>{newCalculation}</p>
                    )
                })
            }
        </div>
    )
}