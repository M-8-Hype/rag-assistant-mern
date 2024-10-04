import { pipeline } from '@xenova/transformers'
import logger from '../config/logger.js'

const extractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

export async function createEmbeddings(chunks) {
    const startTime = Date.now()
    const extractor = await extractorPromise
    const embeddings = await extractor(chunks, {
        pooling: 'mean',
        normalize: true
    })
    const endTime = Date.now()
    logger.info(`Execution time [embedding.js/createEmbeddings]: ${((endTime - startTime) / 1000).toFixed(1)}s`)
    return embeddings
}