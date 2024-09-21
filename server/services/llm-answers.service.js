import LlmAnswers from '../models/llm-answers.model.js'

const llmApiKey = process.env.LLM_API_KEY

export async function getLlmAnswer(prompt, query, callback) {
    try {
        const response = await callPerplexityApi(prompt, query)
        const answer = response.choices[0].message.content
        await saveLlmAnswer(prompt, answer, 'TestUser')
        return callback(null, answer)
    } catch (err) {
        return callback(err, null)
    }
}

async function callPerplexityApi(prompt, query) {
    const instruction = `You are provided with the following context passages:

    ${query}
    
    It is very important that you use only this context to answer the question! Additionally, follow these steps:
    
    Step 1: Carefully read and understand the context provided.
    Step 2: Answer the question using only the information from the context.
    Step 3: If the context does not contain enough information to answer the question, respond with 'I don't know about this topic.'
    Step 4: Do not use any external knowledge or information not included in the context.
    Step 5: Please clearly state the source of your answer.`
    console.log('User content:\n' + prompt)
    console.log('System content:\n' + instruction)
    const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${llmApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-sonar-small-128k-chat',
                messages: [
                    { role: 'system', content: instruction },
                    { role: 'user', content: prompt }
                ]
        })
    }
    const response = await fetch('https://api.perplexity.ai/chat/completions', options)
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
    }
    return await response.json()
}

async function saveLlmAnswer(prompt, answer, user) {
    try {
        const newAnswer = {
            prompt: prompt,
            answer: answer,
            userID: user,
        }
        await LlmAnswers.create(newAnswer)
        console.log('Answer saved successfully')
    } catch (e) {
        console.error('Error saving answer:', e)
        throw e
    }
}