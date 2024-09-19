import styles from './Message.module.scss'
import Markdown from 'markdown-to-jsx'
import { ScaleLoader } from 'react-spinners'
import PropTypes from 'prop-types'
import { MESSAGE_TYPE } from '../../utils/constants.js'

const Message = ({ text, type }) => {
    return (
        <div className={styles[type]}>
            <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            {type === MESSAGE_TYPE[2] ? (
                <ScaleLoader color={"#FFFFFF"} height={30} width={10} margin={5} radius={5} />
            ) : (
                <Markdown>{text}</Markdown>
            )}
        </div>
    )
}

Message.propTypes = {
    type: PropTypes.oneOf(MESSAGE_TYPE).isRequired
}

export default Message