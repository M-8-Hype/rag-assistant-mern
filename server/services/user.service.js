import UserModel from '../models/user.model.js'

export async function getUsers(reqQuery, callback) {
    try {
        const users = await UserModel.find(reqQuery)
        return callback(null, users)
    } catch (err) {
        return callback(err, null)
    }
}

export async function createUser(reqBody, callback) {
    try {
        const user = await UserModel.create(reqBody)
        return callback(null, user)
    } catch (err) {
        return callback(err, null)
    }
}