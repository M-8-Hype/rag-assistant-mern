import { pipeline } from '@xenova/transformers'
import logger from '../config/logger.js'

const extractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

export async function createEmbeddings(chunks, batchSize) {
    const startTime = Date.now()
    const extractor = await extractorPromise
    const allEmbeddings = []
    for (let i = 0; i < chunks.length; i += batchSize) {
        const chunkBatch = chunks.slice(i, i + batchSize)
        const embeddingsBatch = await extractor(chunkBatch, {
            pooling: 'mean',
            normalize: true
        })
        allEmbeddings.push(...embeddingsBatch)
    }
    const endTime = Date.now()
    logger.info(`Execution time [embedding.js/createEmbeddings]: ${((endTime - startTime) / 1000).toFixed(1)}s`)
    return allEmbeddings
}