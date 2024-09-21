import mongoose from 'mongoose'

const LlmAnswersSchema = new mongoose.Schema({
    prompt: { type: String, required: true },
    answer: { type: String, required: true },
    userID: { type: String, required: true },
    tags: { type: [String], default: [] },
}, { timestamps: true })

const LlmAnswers = mongoose.model('LlmAnswers', LlmAnswersSchema)

export default LlmAnswers