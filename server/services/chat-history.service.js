import ChatHistoryModel from '../models/chat-history.model.js'
import mongoose from 'mongoose'
import { filterObjects } from '../utils/object.js'

export async function getChatHistory(reqQuery, callback) {
    try {
        if (reqQuery._id) {
            reqQuery._id = new mongoose.Types.ObjectId(reqQuery._id)
        }
        const chatHistory = await ChatHistoryModel.find(reqQuery)
        const necessaryKeys = ['_id', 'prompt', 'answer']
        let sanitizedChatHistory = filterObjects(chatHistory, necessaryKeys)
        sanitizedChatHistory = sanitizedChatHistory.map(chat => {
            const { _id, prompt: inputText, answer: outputText } = chat
            return { _id, inputText, outputText }
        })
        return callback(null, sanitizedChatHistory)
    } catch (err) {
        return callback(err, null)
    }
}