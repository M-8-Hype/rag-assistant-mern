import { Link } from 'react-router-dom'
import { useContext } from 'react'
import Setting from '../../components/Setting/Setting.jsx'
import SessionContext from '../../state/Context.jsx'

const SettingPage = () => {
    const { settings, setSettings } = useContext(SessionContext)
    const { options } = useContext(SessionContext)

    const handleChange = (e) => {
        const { name, value } = e.target
        setSettings(prevSettings => {
            return { ...prevSettings,
                [name]: value
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div>
            <Link to="/instructions">
                <button>Previous Page</button>
            </Link>
            <Link to="/chat">
                <button>Next Page</button>
            </Link>
            <h2>Settings</h2>
            <form onSubmit={handleSubmit}>
                <Setting
                    name="user"
                    value={settings.user}
                    options={options.users}
                    handleChange={handleChange}
                />
                <Setting
                    name="language"
                    value={settings.language}
                    options={options.languages}
                    handleChange={handleChange}
                />
                <Setting
                    name="database"
                    value={settings.database}
                    options={options.databases}
                    handleChange={handleChange}
                />
            </form>
        </div>
    )
}

export default SettingPage