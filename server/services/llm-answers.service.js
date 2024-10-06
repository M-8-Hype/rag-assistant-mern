import ChatHistoryModel from '../models/chat-history.model.js'
import UserModel from '../models/user.model.js'
import dedent from 'dedent-js'

const llmApiKey = process.env.LLM_API_KEY

export async function getLlmAnswer(reqBody, query, callback) {
    try {
        const response = await callPerplexityApi(reqBody.prompt, query, reqBody.selectedHistory, reqBody.language)
        const answer = response.choices[0].message.content
        await saveLlmAnswer(reqBody.prompt, answer, reqBody.userNickname)
        return callback(null, answer)
    } catch (err) {
        return callback(err, null)
    }
}

async function callPerplexityApi(prompt, query, history, language) {
    const additionalContext = history ?
        `You are provided with additional context from the conversation history between the user and the system:
        
        ${history}` :
        ''
    const languageMap = {
        en: 'English',
        de: 'German',
    }
    const instruction = `You are provided with the following context passages:

    ${query}
    
    ${additionalContext}
    
    Now, please follow these steps:
    
    Step 1: Carefully read and understand the provided context passages.
    Step 2: Answer the question using only the information from the context.
    Step 3: If the context does not contain enough information to answer the question, respond with 'I don't know about this topic.'
    Step 4: Do not use any external knowledge or information not included in the context.
    Step 5: Please clearly state the source of your answer.
    Step 6: Please respond to all queries in ${languageMap[language]}. Do not use any other language for your responses.`
    console.log('User content:\n' + prompt)
    console.log('System content:\n' + dedent(instruction))
    const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${llmApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-sonar-small-128k-chat',
                messages: [
                    { role: 'system', content: dedent(instruction) },
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

async function saveLlmAnswer(prompt, answer, userNickname) {
    const user = await UserModel.findOne({ nickname: userNickname })
    try {
        const newAnswer = {
            prompt: prompt,
            answer: answer,
            userID: user._id,
        }
        await ChatHistoryModel.create(newAnswer)
        console.log('Answer saved successfully')
    } catch (e) {
        console.error('Error saving answer:', e)
        throw e
    }
}