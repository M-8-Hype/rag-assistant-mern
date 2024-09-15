import { pipeline } from '@xenova/transformers'

const extractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

export async function createEmbeddings(chunks) {
    const extractor = await extractorPromise
    return await extractor(chunks, {
        pooling: 'mean',
        normalize: true
    })
}