import { Link } from 'react-router-dom'

const InstructionPage = () => {
    return (
        <div>
            <h2>Instructions</h2>
            <p>Instructions go here...</p>
            <Link to="/chat">
                <button>Next Page</button>
            </Link>
        </div>
    )
}

export default InstructionPage