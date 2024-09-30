export async function fetchChatHistory(filters = {}, setChatHistory = null) {
    const queryParams = new URLSearchParams(filters).toString()
    try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/chat-history${queryParams ? `?${queryParams}` : ''}`)
        const response = await res.json()
        if (setChatHistory) {
            setChatHistory(response.sanitizedChatHistory)
        }
        return response.printText
    } catch (e) {
        console.error(`Error: ${e}`)
    }
}