import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import Setting from '../../components/Setting/Setting.jsx'
import SessionContext from '../../state/Context.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import stylesModal from '../../components/Modal/Modal.module.scss'
import styles from './SettingPage.module.scss'
import { toast } from 'react-toastify'

const SettingPage = () => {
    const { settings, setSettings, options, setOptions } = useContext(SessionContext)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        nickname: "",
        firstName: "",
        lastName: "",
        email: "",
        language: settings.language,
    })

    const handleSettingsChange = (e) => {
        const { name, value } = e.target
        setSettings(prevSettings => {
            return { ...prevSettings,
                [name]: value
            }
        })
    }

    const handleFormDataChange = (e) => {
        const { name, value } = e.target
        setFormData(prevFormData => {
            return { ...prevFormData,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, options)
            if (res.ok) {
                setShowModal(false)
                toast.success('User created successfully!')
                const newUser = { label: formData.nickname, value: formData.nickname }
                setOptions(prevOptions => {
                    return { ...prevOptions, users: [...prevOptions.users, newUser] }
                })
            } else {
                toast.error('Error creating user. Please try again.')
            }
        } catch (e) {
            toast.error('Error creating user. Please try again.')
            console.error(`Error: ${e}`)
        }
    }

    const handleCreateUser = () => {
        setShowModal(true)
    }

    const areAllFieldsFilled = () => {
        return Object.values(formData).every((value) => value.trim() !== '')
    }

    return (
        <div>
            <div className={showModal ? stylesModal.blurBackground : ''}>
                <div className="button-box">
                    <Link to="/instructions">
                        <button>Previous Page</button>
                    </Link>
                    <Link to="/chat">
                        <button>Next Page</button>
                    </Link>
                </div>
                <h2>Settings</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <Setting
                        name="user"
                        value={settings.user}
                        options={options.users}
                        handleChange={handleSettingsChange}
                    >
                        <button type="button" onClick={handleCreateUser}>
                            Create User
                        </button>
                    </Setting>
                    <Setting
                        name="language"
                        value={settings.language}
                        options={options.languages}
                        handleChange={handleSettingsChange}
                    />
                    <Setting
                        name="database"
                        value={settings.database}
                        options={options.databases}
                        handleChange={handleSettingsChange}
                    />
                </form>
            </div>
            {showModal && <Modal setShowModal={setShowModal}>
                <h3>Create User</h3>
                <form onSubmit={handleSubmit} className={styles.createUser}>
                    <label htmlFor="nickname">Nickname</label>
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleFormDataChange}
                    />
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleFormDataChange}
                    />
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleFormDataChange}
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleFormDataChange}
                    />
                    <Setting
                        name="language"
                        value={formData.language}
                        options={options.languages}
                        handleChange={handleFormDataChange}
                    />
                    <button
                        type="submit"
                        disabled={!areAllFieldsFilled()}
                    >
                        Create
                    </button>
                </form>
            </Modal>}
        </div>
    )
}

export default SettingPage