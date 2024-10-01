import styles from './ChatOutput.module.scss'
import { useState, useEffect } from 'react'
import LoadingAnswer from '../LoadingAnswer/LoadingAnswer.jsx'
import Message from '../Message/Message.jsx'
import { MESSAGE_TYPE } from '../../utils/constants.js'

const ChatOutput = ({ inputText, query, isLoading }) => {
    const [chatOutput, setChatOutput] = useState([])

    useEffect(() => {
        if (query) {
            console.log(query)
            const newObject = Object.assign({}, { id: chatOutput.length }, query)
            setChatOutput(prevArray => [...prevArray, newObject])
        }
    }, [query])

    const chatOutputDisplay = chatOutput.map(chatQuery => (
        <div key={chatQuery.id} className={styles.chatQuery}>
            <Message text={chatQuery.inputText} type={MESSAGE_TYPE[0]} />
            <Message text={chatQuery.outputText} type={MESSAGE_TYPE[1]} />
        </div>
        )
    )

    return (
        <div className={styles.chatOutput}>
            <h3>Current Conversation</h3>
            {chatOutputDisplay}
            {isLoading && <LoadingAnswer inputText={inputText}/>}
        </div>
    )
}

export default ChatOutput