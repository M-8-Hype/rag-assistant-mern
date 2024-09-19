import styles from '../ChatOutput/ChatOutput.module.scss'
import Markdown from 'markdown-to-jsx'
import { ScaleLoader } from 'react-spinners'

const Message = ({ text, type }) => {
    let message
    if (type === 'question') {
        message = (
            <div className={styles.question}>
                <h3>Question</h3>
                <p>{text}</p>
            </div>
        )
    } else if (type === 'answer') {
        message = (
            <div className={styles.answer}>
                <h3>Answer</h3>
                <Markdown>{text}</Markdown>
            </div>
        )
    } else {
        message = (
            <div className={styles.answer}>
                <h3>Answer</h3>
                <ScaleLoader color={"#FFFFFF"} height={30} width={10} margin={5} radius={5} />
            </div>
        )
    }

    return message
}

export default Message