import Message from '../Message/Message.jsx'
import { MESSAGE_TYPE } from '../../utils/constants.js'

const ChatHistory = ({ chatHistory }) => {
    const chatHistoryDisplay = chatHistory.map(chatQuery => (
        <div key={chatQuery._id}>
            <Message key={`${chatQuery._id}-input`} text={chatQuery.inputText} type={MESSAGE_TYPE[0]} />
            <Message key={`${chatQuery._id}-output`} text={chatQuery.outputText} type={MESSAGE_TYPE[1]} />
        </div>
        )
    )

    return (
        <div>
            <h2>Chat History</h2>
            {chatHistoryDisplay}
        </div>
    )
}

export default ChatHistory