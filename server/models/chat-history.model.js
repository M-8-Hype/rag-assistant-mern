import mongoose from 'mongoose'

const ChatHistorySchema = new mongoose.Schema({
    prompt: { type: String, required: true },
    answer: { type: String, required: true },
    userID: { type: String, required: true },
    tags: { type: [String], default: [] },
}, { timestamps: true })

const ChatHistoryModel = mongoose.model('ChatHistory', ChatHistorySchema)

export default ChatHistoryModel