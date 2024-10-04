import mongoose from 'mongoose'

const DatabaseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    version: { type: String, required: true },
    metadata: {
        baseUrl: { type: String, required: true },
        count: {
            urls: { type: Number, default: 0 },
            chunks: { type: Number, default: 0 }
        }
    }
}, { timestamps: true })

const DatabaseModel = mongoose.model('Database', DatabaseSchema)

export default DatabaseModel