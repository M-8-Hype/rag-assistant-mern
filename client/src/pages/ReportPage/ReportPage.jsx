import { Link } from 'react-router-dom'
import { fetchChatHistory } from '../../utils/fetch.js'
import { useContext } from 'react'
import SessionContext from '../../state/Context.jsx'
import { saveAs } from 'file-saver'

const ReportPage = () => {
    const { settings } = useContext(SessionContext)

    const handleSaveChat = async () => {
        const chatHistory = await fetchChatHistory({ nickname: settings.user })
        const text = chatHistory.map((chatQuery, index) => {
            return `Query: #${index}\nQuestion: ${chatQuery.inputText}\nAnswer: ${chatQuery.outputText}`
        }).join('\n----------\n')
        console.log(text)
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, 'chat-history.txt')
    }

    return (
        <div>
            <Link to="/chat">
                <button>Previous Page</button>
            </Link>
            <h2>Report</h2>
            <p>After you've finished the chat according to the instructions, please click the following button:</p>
            <button onClick={handleSaveChat}>
                Save Chat
            </button>
        </div>
    )
}

export default ReportPage