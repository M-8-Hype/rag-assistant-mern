import styles from './Chat.module.scss'
import { useEffect, useState } from 'react'
import ChatOutput from '../ChatOutput/ChatOutput'
import ChatHistory from '../ChatHistory/ChatHistory.jsx'

const Chat = () => {
    const [inputText, setInputText] = useState('')
    const [query, setQuery] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [chatHistory, setChatHistory] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/chat-history`)
                const responseText = await res.json()
                setChatHistory(responseText)
            } catch (e) {
                console.error(`Error: ${e}`)
            }
        }
        fetchData()
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
            body: JSON.stringify({ prompt: inputText })
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

    const handleShowHistory = async () => {
        setShowHistory(prevState => !prevState)
    }

    return (
        <>
            {showHistory && <ChatHistory chatHistory={chatHistory} />}
            <button onClick={handleShowHistory}>Click</button>
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
        </>
    )
}

export default Chat