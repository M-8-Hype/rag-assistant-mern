import './App.scss'
import ChatPage from './pages/ChatPage/ChatPage.jsx'
import './styles/style.scss'
import InstructionPage from './pages/InstructionPage/InstructionPage.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import SettingPage from './pages/SettingPage/SettingPage.jsx'
import { SessionProvider } from './state/Context.jsx'

function App() {
    return (
        <>
            <h1>RAG Assistant MERN</h1>
            <SessionProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/instructions" />} />
                    <Route path="/instructions" element={<InstructionPage />} />
                    <Route path="/settings" element={<SettingPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                </Routes>
            </SessionProvider>
        </>
    )
}

export default App
