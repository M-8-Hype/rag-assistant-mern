import styles from './ChatOutput.module.scss'
import { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import LoadingAnswer from '../LoadingAnswer/LoadingAnswer.jsx'
import Message from '../Message/Message.jsx'

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
            <Message text={chatQuery.inputText} type='question' />
            <Message text={chatQuery.outputText} type='answer' />
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