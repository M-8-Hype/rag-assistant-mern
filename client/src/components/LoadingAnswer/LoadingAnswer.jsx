import styles from '../ChatOutput/ChatOutput.module.scss'

const LoadingAnswer = ({ inputText }) => {
    return (
        <div className={styles.question}>
            <h3>Question</h3>
            <p>{inputText}</p>
        </div>
    )
}

export default LoadingAnswer