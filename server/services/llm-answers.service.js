// import { PromptTemplate } from 'langchain'

const llmApiKey = process.env.LLM_API_KEY

export async function getLlmAnswer(query, callback) {
    // const promptTemplate = new PromptTemplate({
    //     template: 'Please tell me briefly about {input}.',
    //     inputVariables: ['input']
    // })
    // const prompt = promptTemplate.format({ input: 'dogs'})
    try {
        const response = await callPerplexityApi('Please tell me briefly about dogs.')
        return callback(null, response)
    } catch (err) {
        return callback(err, null)
    }
}

async function callPerplexityApi(prompt) {
        const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${llmApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
                {role: 'system', content: 'You are a helpful assistant.'},
                {role: 'user', content: prompt}
            ]
        })
    }
    const response = await fetch('https://api.perplexity.ai/chat/completions', options)

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
    }

    return await response.json()
}