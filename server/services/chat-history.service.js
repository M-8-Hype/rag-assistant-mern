import ChatHistoryModel from '../models/chat-history.model.js'
import mongoose from 'mongoose'
import { filterObjects, replaceKey } from '../utils/object.js'
import UserModel from '../models/user.model.js'
import { writeToFile } from '../utils/file.js'

export async function getChatHistory(reqQuery, callback) {
    const { writeToFile: isWriteToFile, ...query } = reqQuery
    try {
        if (query._id) {
            query._id = new mongoose.Types.ObjectId(query._id)
        }
        await ChatHistoryModel.updateMany({ status: 'active' }, { status: 'archived' })
        const user = await UserModel.findOne({ nickname: query.nickname })
        const modifiedquery = replaceKey(query, 'nickname', 'userID', user._id)
        const chatHistory = await ChatHistoryModel.find(modifiedquery)
        const necessaryKeys = ['_id', 'prompt', 'answer']
        let sanitizedChatHistory = filterObjects(chatHistory, necessaryKeys)
        sanitizedChatHistory = sanitizedChatHistory.map(chat => {
            const { _id, prompt: inputText, answer: outputText } = chat
            return { _id, inputText, outputText }
        })
        if (isWriteToFile) {
            // TODO: Remove redundant code from client/src/pages/ReportPage/ReportPage.jsx
            const text = sanitizedChatHistory.map((chatQuery, index) => {
                return `Query: #${index}\nQuestion: ${chatQuery.inputText}\nAnswer: ${chatQuery.outputText}`
            }).join('\n----------\n')
            const lowerCaseNickname = query.nickname.replaceAll(' ', '').toLowerCase()
            await writeToFile(text, './output', `chat-history-${lowerCaseNickname}.txt`)
        }
        return callback(null, sanitizedChatHistory)
    } catch (err) {
        return callback(err, null)
    }
}