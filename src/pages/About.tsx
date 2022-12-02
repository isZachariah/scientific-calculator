import Layout from "../components/Layout";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faLinkedin, faYoutube} from "@fortawesome/free-brands-svg-icons";


export const About = () => {
    return (
        <>
            <Layout >
                <div className={'flex justify-center m-auto w-screen align-middle pt-12'}>
                    <div className={'flex flex-col w-1/3 justify-center align-middle m-auto text-center'}>
                        <div className={'justify-center align-middle m-auto gap-4 flex flex-col'}>
                            <p className={'text-2xl'}>
                                Project made by Zachariah Angus Magee
                            </p>
                            <p className={'font-bold italic'}>
                                Created with TypeScript, React, Vite, and Tailwindcss.
                            </p>
                            <p className={'italic'}>
                                I also have experience building mobile apps with Kotlin and Java. I enjoy programming with other languages as well, including Python, Rust, and Go.
                            </p>
                        </div>

                        <div className={'flex flex-row gap-28 pt-36 text-center align-middle justify-center'}>
                            <a className={'font-9xl'} href={'https://github.com/isZachariah'}>
                                <FontAwesomeIcon style={{
                                    fontSize: '5rem',
                                    color: '#ADD8E6'
                                }} icon={faGithub} />
                            </a>
                            <a className={''} href={'https://www.linkedin.com/in/zachariahmagee/'}>
                                <FontAwesomeIcon style={{
                                    fontSize: '5rem',
                                    color: '#ADD8E6'
                                }} icon={faLinkedin} />
                            </a>
                            <a className={''} href={'https://www.youtube.com/channel/UCx7PcDWz1RQ8T-cUwPpLgbg'}>
                                <FontAwesomeIcon style={{
                                    fontSize: '5rem',
                                    color: '#ADD8E6'
                                }} icon={faYoutube} />
                            </a>
                        </div>
                    </div>


                </div>
            </Layout>

        </>
    )
}

//