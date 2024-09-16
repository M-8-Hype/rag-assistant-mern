import styles from './Chat.module.scss'
import { useState } from 'react'

const Chat = () => {
    const [inputText, setInputText] = useState('')

    const handleChange = (e) => {
        const { value } = e.target
        setInputText(() => value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <>
            <div className={styles.chatOutput}>
                <p>Chat will be displayed here</p>
            </div>
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
                <button>
                    Send
                </button>
            </form>
        </>
    )
}

export default Chat