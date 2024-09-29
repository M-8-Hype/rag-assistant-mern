import { Link } from 'react-router-dom'
import { INSTRUCTION } from '../../utils/texts.js'

const InstructionPage = () => {
    const instructionSteps = INSTRUCTION.steps.map((step, index) => {
        return (
            <li key={index}>
                <p>{step.text}</p>
                {step.subItems && <ol>
                    {step.subItems && step.subItems.map((subItem, subIndex) => {
                        return (
                            <li key={subIndex}>
                                <p>{subItem.text}</p>
                            </li>
                        )
                    })}
                </ol>}
                {step.conclusion && <p>{step.conclusion}</p>}
            </li>
        )
    })

    return (
        <div>
            <Link to="/settings">
                <button>Next Page</button>
            </Link>
            <h2>Instructions</h2>
            <div>
                <p>{INSTRUCTION.introduction}</p>
                <ul>{instructionSteps}</ul>
                <p>{INSTRUCTION.conclusion}</p>
            </div>
            <Link to="/settings">
                <button>View Settings</button>
            </Link>
        </div>
    )
}

export default InstructionPage