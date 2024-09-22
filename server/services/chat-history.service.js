import ChatHistoryModel from '../models/chat-history.model.js'
import mongoose from 'mongoose'
import { filterObjects } from '../utils/object.js'

export async function getChatHistory(reqQuery, callback) {
    try {
        if (reqQuery._id) {
            reqQuery._id = new mongoose.Types.ObjectId(reqQuery._id)
        }
        await ChatHistoryModel.updateMany({ status: 'active' }, { status: 'archived' })
        const chatHistory = await ChatHistoryModel.find(reqQuery)
        const necessaryKeys = ['_id', 'prompt', 'answer']
        let sanitizedChatHistory = filterObjects(chatHistory, necessaryKeys)
        sanitizedChatHistory = sanitizedChatHistory.map(chat => {
            const { _id, prompt: inputText, answer: outputText, status } = chat
            return { _id, inputText, outputText, status }
        })
        return callback(null, sanitizedChatHistory)
    } catch (err) {
        return callback(err, null)
    }
}