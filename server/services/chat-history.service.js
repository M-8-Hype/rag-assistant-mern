import ChatHistoryModel from '../models/chat-history.model.js'
import mongoose from 'mongoose'
import { filterObjects, replaceKey } from '../utils/object.js'
import UserModel from '../models/user.model.js'
import { writeToFile } from '../utils/file.js'
import dedent from 'dedent-js'

export async function getChatHistory(reqQuery, callback) {
    const { writeToFile: isWriteToFile, ...query } = reqQuery
    try {
        if (query._id) {
            query._id = new mongoose.Types.ObjectId(query._id)
        }
        await ChatHistoryModel.updateMany({ status: 'active' }, { status: 'archived' })
        const user = await UserModel.findOne({ nickname: query.nickname })
        const modifiedQuery = replaceKey(query, 'nickname', 'userID', user._id)
        const chatHistory = await ChatHistoryModel.find(modifiedQuery)
        const necessaryKeys = ['_id', 'prompt', 'answer']
        let sanitizedChatHistory = filterObjects(chatHistory, necessaryKeys)
        sanitizedChatHistory = sanitizedChatHistory.map(chat => {
            const { _id, prompt: inputText, answer: outputText } = chat
            return { _id, inputText, outputText }
        })
        const prependedText =
            `[Chat history for:]
            ${user.firstName} ${user.lastName} (${user.nickname} / ${user.email})
            [Printed on:]
            ${new Date().toUTCString()}
            -----------------------------`
        const textChatHistory = sanitizedChatHistory.map((chatQuery, index) => {
            return `Query: #${index}\nQuestion: ${chatQuery.inputText}\nAnswer: ${chatQuery.outputText}`
        }).join('\n----------\n')
        const printText = dedent(prependedText).concat('\n', textChatHistory)
        console.log(printText)
        if (isWriteToFile) {
            const lowerCaseNickname = query.nickname.replaceAll(' ', '').toLowerCase()
            await writeToFile(printText, './output', `chat-history-${lowerCaseNickname}.txt`)
        }
        return callback(null, { sanitizedChatHistory, printText })
    } catch (err) {
        return callback(err, null)
    }
}