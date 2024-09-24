import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Setting from '../../components/Setting/Setting.jsx'

const SettingPage = () => {
    const [formData, setFormData] = useState({
        user: '',
        language: '',
        database: ''
    })

    useEffect(() => {
        setFormData({
            user: validateArray(users),
            language: validateArray(languages),
            database: validateArray(databases)
        })
    }, [])

    const users = [
        { label: 'User 1', value: 'user1' },
        { label: 'User 2', value: 'user2' },
        { label: 'User 3', value: 'user3' }
    ]

    const languages = [
        { label: 'English', value: 'en' },
        { label: 'German', value: 'de' }
    ]

    const databases = [
        { label: 'Database 1', value: 'db1' },
        { label: 'Database 2', value: 'db2' }
    ]

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevFormData => {
            return { ...prevFormData,
                [name]: value
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
    }

    function validateArray(array) {
        return array.length > 0 ? array[0].value : ''
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
                    value={formData.user}
                    options={users}
                    handleChange={handleChange}
                />
                <Setting
                    name="language"
                    value={formData.language}
                    options={languages}
                    handleChange={handleChange}
                />
                <Setting
                    name="database"
                    value={formData.database}
                    options={databases}
                    handleChange={handleChange}
                />
                <button type="submit">
                    Save
                </button>
            </form>
        </div>
    )
}

export default SettingPage