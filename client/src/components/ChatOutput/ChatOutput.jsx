import styles from './ChatOutput.module.scss'
import { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'

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
            <h3>Question</h3>
            <p>{chatQuery.inputText}</p>
            <h3>Answer</h3>
            <Markdown>{chatQuery.outputText}</Markdown>
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