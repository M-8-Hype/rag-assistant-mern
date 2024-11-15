import styles from './ChatPage.module.scss'
import stylesModal from '../../components/Modal/Modal.module.scss'
import { useContext, useEffect, useState } from 'react'
import ChatOutput from '../../components/ChatOutput/ChatOutput.jsx'
import ChatHistory from '../../components/ChatHistory/ChatHistory.jsx'
import { Link } from 'react-router-dom'
import SessionContext from '../../state/Context.jsx'
import { fetchChatHistory } from '../../utils/fetch.js'
import Modal from '../../components/Modal/Modal.jsx'
import { getChatInstructionsAsJsx } from '../../utils/texts.jsx'

const ChatPage = () => {
    const [inputText, setInputText] = useState('')
    const [query, setQuery] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [chatHistory, setChatHistory] = useState([])
    const [showSelection, setShowSelection] = useState(false)
    const [selectedQueries, setSelectedQueries] = useState([])
    const [showInstruction, setShowInstruction] = useState(false)
    const [showRating, setShowRating] = useState(false)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [selectedRating, setSelectedRating] = useState("")
    const { settings } = useContext(SessionContext)

    useEffect(() => {
        fetchChatHistory({ nickname: settings.user }, setChatHistory)
    }, [])

    const handleChange = (e) => {
        const { value } = e.target
        setInputText(() => value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setIsButtonDisabled(true)
        const selection = chatHistory.filter(chatQuery => selectedQueries.includes(chatQuery._id))
        const selectedOutputText = selection.map((chatQuery, index) => {
            return `Query: #${index}\nQuestion: ${chatQuery.inputText}\nAnswer: ${chatQuery.outputText}`
        }).join('\n\n')
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: inputText,
                userNickname: settings.user,
                language: settings.language,
                database: settings.database,
                selectedHistory: selectedOutputText
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

    const handleSubmitRating = async (e) => {
        e.preventDefault()
    }

    const handleShowHistory = () => {
        setShowHistory(prevState => !prevState)
    }

    const handleShowSelection = () => {
        setShowSelection(prevState => !prevState)
    }

    const handleShowInstruction = () => {
        setShowInstruction(prevState => !prevState)
    }

    const handleRatingChange = (e) => {
        setSelectedRating(e.target.value)
    }

    return (
        <div className={styles.chatPage}>
            <div className={showInstruction || showRating ? stylesModal.blurBackground : ''}>
                <div className="button-box">
                    <Link to="/settings">
                        <button>Previous Page</button>
                    </Link>
                    <Link to="/report">
                        <button>Next Page</button>
                    </Link>
                </div>
                <h2>Chat</h2>
                {showHistory && <ChatHistory
                    chatHistory={chatHistory}
                    showSelection={showSelection}
                    selectedQueries={selectedQueries}
                    setSelectedQueries={setSelectedQueries}
                />}
                <div className="button-box">
                    <button onClick={handleShowHistory}>{showHistory ? 'Close History' : 'Show History'}</button>
                    {showHistory && <button onClick={handleShowSelection}>{showSelection ? 'Save Selection' : 'Select Messages'}</button>}
                </div>
                <ChatOutput
                    inputText={inputText}
                    query={query}
                    isLoading={isLoading}
                    setShowRating={setShowRating}
                    isButtonDisabled={isButtonDisabled}
                />
                <form className={styles.chatInput} onSubmit={handleSubmit}>
                    <label htmlFor="name">Please enter your question here</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={inputText}
                        placeholder="Please enter your question here..."
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="submit"
                        disabled={isButtonDisabled}
                    >
                        Send
                    </button>
                </form>
                <button onClick={handleShowInstruction}>
                    Show Chat Instructions
                </button>
            </div>
            {showInstruction && <Modal setShowModal={setShowInstruction}>
                <h3>Chat Instructions</h3>
                {getChatInstructionsAsJsx()}
            </Modal>}
            {showRating && <Modal setShowModal={setShowRating}>
                <h3>Rating</h3>
                <div id="rating">
                    <p>
                        Please rate the answer you received by German school grades, ranging from 1 (best) to 5 (worst).
                    </p>
                    <form onSubmit={handleSubmitRating}>
                        <div className={styles.ratingGrades}>
                            <div>
                                <label htmlFor="rating">1</label>
                                <input
                                    type="radio"
                                    name="rating"
                                    value="1"
                                    checked={selectedRating === "1"}
                                    onChange={handleRatingChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="rating">2</label>
                                <input
                                    type="radio"
                                    name="rating"
                                    value="2"
                                    checked={selectedRating === "2"}
                                    onChange={handleRatingChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="rating">3</label>
                                <input
                                    type="radio"
                                    name="rating"
                                    value="3"
                                    checked={selectedRating === "3"}
                                    onChange={handleRatingChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="rating">4</label>
                                <input
                                    type="radio"
                                    name="rating"
                                    value="4"
                                    checked={selectedRating === "4"}
                                    onChange={handleRatingChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="rating">5</label>
                                <input
                                    type="radio"
                                    name="rating"
                                    value="5"
                                    checked={selectedRating === "5"}
                                    onChange={handleRatingChange}
                                />
                            </div>
                        </div>
                        <button type="submit">
                            Send Rating
                        </button>
                    </form>
                </div>
            </Modal>}
        </div>
    )
}

export default ChatPage