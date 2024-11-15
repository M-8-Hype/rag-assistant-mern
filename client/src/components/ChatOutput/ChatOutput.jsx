import styles from './ChatOutput.module.scss'
import { useState, useEffect } from 'react'
import LoadingAnswer from '../LoadingAnswer/LoadingAnswer.jsx'
import Message from '../Message/Message.jsx'
import { MESSAGE_TYPE } from '../../utils/constants.js'

const ChatOutput = ({ inputText, query, isLoading, setShowRating, isButtonDisabled }) => {
    const [chatOutput, setChatOutput] = useState([])

    useEffect(() => {
        if (query) {
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

    const handleRateAnswer = () => {
        setShowRating(true)
    }

    return (
        <div className={styles.chatOutput} id="chatOutput">
            <h3>Active Conversation</h3>
            {chatOutput.length === 0 ? "There are no active messages." : chatOutputDisplay}
            {isLoading && <LoadingAnswer inputText={inputText}/>}
            {isButtonDisabled && <button onClick={handleRateAnswer}>
                Rate This Answer
            </button>}
        </div>
    )
}

export default ChatOutput