import { Link } from 'react-router-dom'
import { fetchChatHistory } from '../../utils/fetch.js'
import { useContext } from 'react'
import SessionContext from '../../state/Context.jsx'
import { saveAs } from 'file-saver'
import { toast } from 'react-toastify'
import styles from './ReportPage.module.scss'

const ReportPage = () => {
    const { settings } = useContext(SessionContext)

    const handleSaveChat = async () => {
        const textChatHistory = await fetchChatHistory({
            nickname: settings.user,
            writeToFile: true
        })
        const blob = new Blob([textChatHistory], { type: 'text/plain;charset=utf-8' })
        const lowerCaseNickname = settings.user.replaceAll(' ', '').toLowerCase()
        try {
            saveAs(blob, `chat-history-${lowerCaseNickname}.txt`)
            toast.info('File is ready for download!')
        } catch (e) {
            toast.error('Error saving file. Please try again.')
            console.error('Error:', e)
        }
    }

    return (
        <div className={styles.reportPage}>
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