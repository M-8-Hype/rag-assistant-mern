import styles from './ChatOutput.module.scss'
import { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import LoadingAnswer from '../LoadingAnswer/LoadingAnswer.jsx'

const ChatOutput = ({ inputText, query, isLoading }) => {
    const [chatHistory, setChatHistory] = useState([])

    useEffect(() => {
        if (query) {
            console.log(query)
            const newObject = Object.assign({}, { id: chatHistory.length }, query)
            setChatHistory(prevArray => [...prevArray, newObject])
        }
    }, [query])

    const chatHistoryDisplay = chatHistory.map(chatQuery => (
        <div key={chatQuery.id} className={styles.chatQuery}>
            <div className={styles.question}>
                <h3>Question</h3>
                <p>{chatQuery.inputText}</p>
            </div>
            <div className={styles.answer}>
                <h3>Answer</h3>
                <Markdown>{chatQuery.outputText}</Markdown>
            </div>
        </div>
        )
    )

    return (
        <div className={styles.chatOutput}>
            {chatHistoryDisplay}
            {isLoading && <LoadingAnswer inputText={inputText} />}
        </div>
    )
}

export default ChatOutput