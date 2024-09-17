import styles from './ChatOutput.module.scss'
import { useState, useEffect } from 'react'

const ChatOutput = ({ query }) => {
    const [chatHistory, setChatHistory] = useState([])

    useEffect(() => {
        if (query) {
            console.log(query)
            const newObject = Object.assign({}, { id: chatHistory.length }, query)
            setChatHistory(prevArray => [...prevArray, newObject])
        }
    }, [query])

    const chatDisplay = chatHistory.map(chatQuery => (
        <div key={chatQuery.id} className={styles.chatOutput}>
            <p>Question: {chatQuery.inputText}</p>
            <p>Answer: {chatQuery.outputText}</p>
        </div>
        )

    )

    return (
        <div className={styles.chatDisplay}>
            {chatDisplay}
        </div>
    )
}

export default ChatOutput