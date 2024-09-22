import ChatHistoryModel from '../models/chat-history.model.js'
import mongoose from 'mongoose'

export async function getChatHistory(reqQuery, callback) {
    try {
        if (reqQuery._id) {
            reqQuery._id = new mongoose.Types.ObjectId(reqQuery._id)
        }
        const chatHistory = await ChatHistoryModel.find(reqQuery)
        return callback(null, chatHistory)
    } catch (err) {
        return callback(err, null)
    }
}