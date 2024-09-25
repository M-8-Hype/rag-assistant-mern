import { createContext, useEffect, useState } from 'react'

const SessionContext = createContext(null)

export const SessionProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        user: '',
        language: '',
        database: ''
    })
    const [options, setOptions] = useState({
        users: [],
        languages: [
            { label: 'English', value: 'en' },
            { label: 'German', value: 'de' }
        ],
        databases: [
            { label: 'Database 1', value: 'db1' },
            { label: 'Database 2', value: 'db2' }
        ]
    })

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`)
                const responseText = await res.json()
                const users = []
                responseText.forEach(user => {
                    users.push({
                        label: user.nickname,
                        value: user.nickname
                    })
                })
                setOptions(prevOptions => {
                    return { ...prevOptions, users }
                })
            } catch (e) {
                console.error(`Error: ${e}`)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        setSettings({
            user: validateArray(options.users),
            language: validateArray(options.languages),
            database: validateArray(options.databases)
        })
    }, [options])

    function validateArray(array) {
        return array.length > 0 ? array[0].value : ''
    }

    return (
        <SessionContext.Provider value={{ settings, setSettings, options }}>
            {children}
        </SessionContext.Provider>
    )
}

export default SessionContext