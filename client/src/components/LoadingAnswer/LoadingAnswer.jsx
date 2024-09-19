import styles from '../ChatOutput/ChatOutput.module.scss'
import { ScaleLoader } from 'react-spinners'

const LoadingAnswer = ({ inputText }) => {
    return (
        <>
            <div className={styles.question}>
                <h3>Question</h3>
                <p>{inputText}</p>
            </div>
            <div className={styles.answer}>
                <h3>Answer</h3>
                <ScaleLoader color={"#FFFFFF"} height={30} width={10} margin={5} radius={5} />
            </div>
        </>
)
}

export default LoadingAnswer