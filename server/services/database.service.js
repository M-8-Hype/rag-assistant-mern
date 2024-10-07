import DatabaseModel from '../models/database.model.js'
import logger from '../config/logger.js'

export async function getDatabases(reqQuery, callback) {
    try {
        const databases = await DatabaseModel.find(reqQuery)
        return callback(null, databases)
    } catch (err) {
        return callback(err, null)
    }
}

export async function createDatabase(reqBody, resObject, callback) {
    const databaseDetails = {
        ...reqBody,
        name: resObject.collectionName,
        metadata: {
            ...reqBody.metadata,
            count: { urls: resObject.urlCount, chunks: resObject.chunkCount },
            urls: resObject.urls,
            model: { name: resObject.modelName, dimensions: resObject.modelDimensions }
        }
    }
    try {
        const database = await DatabaseModel.create(databaseDetails)
        return callback(null, database)
    } catch (err) {
        return callback(err, null)
    }
}