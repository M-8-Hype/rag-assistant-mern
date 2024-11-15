import Message from '../Message/Message.jsx'
import { MESSAGE_TYPE } from '../../utils/constants.js'
import styles from './ChatHistory.module.scss'

const ChatHistory = ({ chatHistory, showSelection, selectedQueries, setSelectedQueries }) => {
    const chatHistoryDisplay = chatHistory.map(chatQuery => {
        const isChecked = selectedQueries.includes(chatQuery._id)
        return <div key={chatQuery._id} id={`${chatQuery._id}-query`} className={styles.query}>
            {showSelection && <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleSelect(chatQuery._id)}
            />}
            <div className={`${styles.querymessages}${isChecked ? ' checked' : ''}`}>
                <Message key={`${chatQuery._id}-input`} text={chatQuery.inputText} type={MESSAGE_TYPE[0]}/>
                <Message key={`${chatQuery._id}-output`} text={chatQuery.outputText} type={MESSAGE_TYPE[1]}/>
            </div>
        </div>
    })

    const handleSelect = (id) => {
        setSelectedQueries(prevSelectedQueries => {
            return prevSelectedQueries.includes(id) ?
                prevSelectedQueries.filter(queryId => queryId !== id) :
                [...prevSelectedQueries, id]
        })
    }

    return (
        <div id="chatHistory" className={styles.chatHistory}>
            <h3>Chat History</h3>
            {chatHistoryDisplay.length === 0 ? "There is no chat history." : chatHistoryDisplay}
        </div>
    )
}

export default ChatHistory