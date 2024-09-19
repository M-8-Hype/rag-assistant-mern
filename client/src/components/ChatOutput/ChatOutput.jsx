import styles from './ChatOutput.module.scss'
import { useState, useEffect } from 'react'
import LoadingAnswer from '../LoadingAnswer/LoadingAnswer.jsx'
import Message from '../Message/Message.jsx'
import { MESSAGE_TYPE } from '../../utils/constants.js'

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
            <Message text={chatQuery.inputText} type={MESSAGE_TYPE[0]} />
            <Message text={chatQuery.outputText} type={MESSAGE_TYPE[1]} />
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