import mongoose from 'mongoose'

const DatabaseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    version: { type: String, required: true },
    game: { type: String, required: true },
    genre: { type: [String], default: [] },
    category: [{ type: String, enum: ['walkthrough', 'controls'], default: ['walkthrough'] }],
    metadata: {
        baseUrl: { type: String, required: true },
        urls: { type: [String], default: [] },
        count: {
            urls: { type: Number, default: 0 },
            chunks: { type: Number, default: 0 }
        },
        model: {
            name: { type: String, required: true },
            dimensions: { type: Number, required: true }
        }
    }
}, { timestamps: true })

const DatabaseModel = mongoose.model('Database', DatabaseSchema)

export default DatabaseModel