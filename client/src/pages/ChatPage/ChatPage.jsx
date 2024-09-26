import styles from './ChatPage.module.scss'
import { useContext, useEffect, useState } from 'react'
import ChatOutput from '../../components/ChatOutput/ChatOutput.jsx'
import ChatHistory from '../../components/ChatHistory/ChatHistory.jsx'
import { Link } from 'react-router-dom'
import SessionContext from '../../state/Context.jsx'

const ChatPage = () => {
    const [inputText, setInputText] = useState('')
    const [query, setQuery] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [chatHistory, setChatHistory] = useState([])
    const [showSelection, setShowSelection] = useState(false)
    const [selectedQueries, setSelectedQueries] = useState([])
    const { settings } = useContext(SessionContext)

    useEffect(() => {
        async function fetchData(filters = {}) {
            const queryParams = new URLSearchParams(filters).toString()
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/chat-history${queryParams ? `?${queryParams}` : ''}`)
                const responseText = await res.json()
                setChatHistory(responseText)
            } catch (e) {
                console.error(`Error: ${e}`)
            }
        }
        fetchData({ nickname: settings.user })
    }, []);

    const handleChange = (e) => {
        const { value } = e.target
        setInputText(() => value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: inputText,
                userNickname: settings.user
            })
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/llm-answers`, options)
            const responseText = await res.json()
            setIsLoading(false)
            setQuery({
                inputText: inputText,
                outputText: responseText
            })
        } catch (e) {
            console.error(`Error: ${e}`)
        }
    }

    const handleShowHistory = () => {
        setShowHistory(prevState => !prevState)
    }

    const handleShowSelection = () => {
        setShowSelection(prevState => !prevState)
        const selection = chatHistory.filter(chatQuery => selectedQueries.includes(chatQuery._id))
        const selectedText = selection.map(chatQuery => chatQuery.inputText).join('\n')
        console.log(selectedText)
    }

    return (
        <div className={styles.chatPage}>
            <Link to="/settings">
                <button>Previous Page</button>
            </Link>
            {showHistory && <ChatHistory
                chatHistory={chatHistory}
                showSelection={showSelection}
                selectedQueries={selectedQueries}
                setSelectedQueries={setSelectedQueries}
            />}
            <div>
                <button onClick={handleShowHistory}>{showHistory ? 'Close' : 'Expand'}</button>
                {showHistory && <button onClick={handleShowSelection}>{showSelection ? 'Save Selection' : 'Select'}</button>}
            </div>
            <ChatOutput
                inputText={inputText}
                query={query}
                isLoading={isLoading}
            />
            <form className={styles.chatInput} onSubmit={handleSubmit}>
                <label htmlFor="name">Enter your text:</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={inputText}
                    onChange={handleChange}
                    required
                />
                <button type="submit">
                    Send
                </button>
            </form>
        </div>
    )
}

export default ChatPage