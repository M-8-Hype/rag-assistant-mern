export async function fetchChatHistory(filters = {}, setChatHistory = null) {
    const queryParams = new URLSearchParams(filters).toString()
    try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/chat-history${queryParams ? `?${queryParams}` : ''}`)
        const responseText = await res.json()
        if (setChatHistory) {
            setChatHistory(responseText)
        }
        return responseText
    } catch (e) {
        console.error(`Error: ${e}`)
    }
}