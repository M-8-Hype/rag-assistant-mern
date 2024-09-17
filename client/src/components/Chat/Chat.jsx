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

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch('http://localhost:3001/responses')
            .then(res => res.json())
            .then(data => {
                const newOutputText = data[0].message
                setQuery({
                    inputText: inputText,
                    outputText: newOutputText
                })
            })
            .catch(e => console.error(`Error: ${e}`))
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