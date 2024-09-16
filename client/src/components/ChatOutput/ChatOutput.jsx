import styles from './ChatOutput.module.scss'

const ChatOutput = ({ outputText }) => {
    return (
        <>
            <div className={styles.chatOutput}>
                {outputText && <p>{outputText}</p>}
            </div>
        </>
    )
}

export default ChatOutput