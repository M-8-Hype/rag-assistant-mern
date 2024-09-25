import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    nickname: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'] },
    language: { type: String, enum: ['en', 'de'], default: 'en' },
})

const UserModel = mongoose.model('User', UserSchema)

export default UserModel