import styles from './Chat.module.scss'
import { useState } from 'react'
import ChatOutput from '../ChatOutput/ChatOutput'

const Chat = () => {
    const [inputText, setInputText] = useState('')
    const [query, setQuery] = useState(null)

    const handleChange = (e) => {
        const { value } = e.target
        setInputText(() => value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: inputText })
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/llm-answers`, options)
            const data = await res.json()
            const responseText = data.choices[0].message.content
            setQuery({
                inputText: inputText,
                outputText: responseText
            })
        } catch (e) {
            console.error(`Error: ${e}`)
        }
    }

    return (
        <>
            <ChatOutput query={query} />
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