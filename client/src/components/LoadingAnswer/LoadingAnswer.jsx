import Message from '../Message/Message.jsx'

const LoadingAnswer = ({ inputText }) => {
    return (
        <>
            <Message text={inputText} type='question' />
            <Message type='loading' />
        </>
)
}

export default LoadingAnswer