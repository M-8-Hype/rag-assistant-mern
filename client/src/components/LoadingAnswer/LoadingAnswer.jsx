import Message from '../Message/Message.jsx'
import { MESSAGE_TYPE } from '../../utils/constants.js'

const LoadingAnswer = ({ inputText }) => {
    return (
        <div>
            <Message text={inputText} type={MESSAGE_TYPE[0]} />
            <Message type={MESSAGE_TYPE[2]} />
        </div>
)
}

export default LoadingAnswer