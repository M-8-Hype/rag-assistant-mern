import startContainer from '../docker/container.js'
import mongoose from 'mongoose'
import config from 'config'

const MONGO_HTTP_PORT = process.env.MONGO_HTTP_PORT || 27017

let _db
const connectionString = config.get('db.connectionString')

export async function startMongoDb() {
    try {
        await startContainer(
            'mongodb',
            'mongo',
            '8.0.0-noble',
            '/storage/mongodb',
            '/data/db',
            MONGO_HTTP_PORT,
        )
    } catch (e) {
        console.error(`Error managing MongoDB container: ${e.message}`)
        process.exit(1)
    }
}

export async function initDB(callback) {
    if (_db) {
        if (callback) {
            return callback(null, _db)
        } else {
            return _db
        }
    } else {
        try {
            _db = await mongoose.connect(connectionString)
            console.log("Connected to database " + connectionString)
            if (callback) {
                callback(null, _db)
            }
        } catch (e) {
            console.error('Connection to database failed:', e)
            if (callback) {
                callback(e)
            }
        }
    }
}