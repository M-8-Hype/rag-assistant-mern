import { Link } from 'react-router-dom'
import { INSTRUCTION, getInstructionStepsAsJsx } from '../../utils/texts.jsx'
import styles from './InstructionPage.module.scss'

const InstructionPage = () => {
    return (
        <div className={styles.instructionPage}>
            <Link to="/settings">
                <button>Next Page</button>
            </Link>
            <h2>Instructions</h2>
            <div>
                <p>{INSTRUCTION.introduction}</p>
                <ul>{getInstructionStepsAsJsx()}</ul>
                <p>{INSTRUCTION.conclusion}</p>
            </div>
            <Link to="/settings">
                <button>View Settings</button>
            </Link>
        </div>
    )
}

export default InstructionPage