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
        databases: []
    })

    useEffect(() => {
        async function fetchData() {
            try {
                const [usersRes, databasesRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_SERVER_URL}/users`),
                    fetch(`${import.meta.env.VITE_SERVER_URL}/databases`)
                ])
                const usersData = await usersRes.json()
                const databasesData = await databasesRes.json()
                const users = usersData.map(user => ({
                    label: user.nickname,
                    value: user.nickname
                }))
                const databases = databasesData.map(database => ({
                    label: database.game,
                    value: database.name
                }))
                setOptions(prevOptions => ({
                    ...prevOptions,
                    users,
                    databases
                }))
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