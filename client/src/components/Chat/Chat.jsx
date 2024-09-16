import styles from './Chat.module.scss'
import { useState } from 'react'
import ChatOutput from '../ChatOutput/ChatOutput'

const Chat = () => {
    const [inputText, setInputText] = useState('')
    const [outputText, setOutputText] = useState('')

    const handleChange = (e) => {
        const { value } = e.target
        setInputText(() => value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch('http://localhost:3001/responses')
            .then(res => res.json())
            .then(data => {
                setOutputText(data[0].message)
            })
            .catch(e => console.error(`Error: ${e}`))
    }

    return (
        <>
            <ChatOutput outputText={outputText} />
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