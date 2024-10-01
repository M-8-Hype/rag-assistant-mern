import Message from '../Message/Message.jsx'
import { MESSAGE_TYPE } from '../../utils/constants.js'

const ChatHistory = ({ chatHistory, showSelection, selectedQueries, setSelectedQueries }) => {
    const chatHistoryDisplay = chatHistory.map(chatQuery => (
        <div key={chatQuery._id} id={`${chatQuery._id}-query`}>
            {showSelection && <input
                type="checkbox"
                checked={selectedQueries.includes(chatQuery._id)}
                onChange={() => handleSelect(chatQuery._id)}
            />}
            <Message key={`${chatQuery._id}-input`} text={chatQuery.inputText} type={MESSAGE_TYPE[0]} />
            <Message key={`${chatQuery._id}-output`} text={chatQuery.outputText} type={MESSAGE_TYPE[1]} />
        </div>
        )
    )

    const handleSelect = (id) => {
        setSelectedQueries(prevSelectedQueries => {
            return prevSelectedQueries.includes(id) ?
                prevSelectedQueries.filter(queryId => queryId !== id) :
                [...prevSelectedQueries, id]
        })
    }

    return (
        <div id="chatHistory">
            <h3>Chat History</h3>
            {chatHistoryDisplay}
        </div>
    )
}

export default ChatHistory