import DatabaseModel from '../models/database.model.js'

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
        const database = await DatabaseModel.findOneAndUpdate(
            { name: resObject.collectionName },
            {
                $set: {
                    'name': databaseDetails.name,
                    'version': databaseDetails.version,
                    'game': databaseDetails.game,
                    'genre': databaseDetails.genre,
                    'category': databaseDetails.category,
                    'metadata.model': databaseDetails.metadata.model
                },
                $inc: {
                    'metadata.count.urls': databaseDetails.metadata.count.urls,
                    'metadata.count.chunks': databaseDetails.metadata.count.chunks
                },
                $addToSet: {
                    'metadata.urls': { $each: databaseDetails.metadata.urls },
                    'metadata.baseUrls': { $each: databaseDetails.metadata.baseUrls }
                }
            },
            { new: true, upsert: true }
        )
        return callback(null, database)
    } catch (err) {
        return callback(err, null)
    }
}