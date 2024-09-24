import { Link } from 'react-router-dom'

const InstructionPage = () => {
    return (
        <div>
            <Link to="/chat">
                <button>Next Page</button>
            </Link>
            <h2>Instructions</h2>
            <p>Instructions go here...</p>
        </div>
    )
}

export default InstructionPage