import styles from './Chat.module.scss'

const Chat = () => {
    return (
        <>
            <div className={styles.chatOutput}>
                <p>Chat will be displayed here</p>
            </div>
            <div className={styles.chatInput}>
                <label htmlFor="name">Enter your text:</label>
                <input type="text" name="name" id="name" required />
            </div>
        </>
    )
}

export default Chat