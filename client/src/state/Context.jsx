import { createContext, useEffect, useState } from 'react'
import { DROPDOWN_OPTIONS } from '../utils/constants.js'

const SessionContext = createContext(null)

export const SessionProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        user: '',
        language: '',
        database: ''
    })
    const [options, setOptions] = useState({
        users: [],
        languages: DROPDOWN_OPTIONS.languages,
        databases: DROPDOWN_OPTIONS.databases
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
        return array.length > 0 ? array[array.length - 1].value : ''
    }

    return (
        <SessionContext.Provider value={{ settings, setSettings, options, setOptions }}>
            {children}
        </SessionContext.Provider>
    )
}

export default SessionContext