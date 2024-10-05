import fetch from 'node-fetch'
import { parseStringPromise } from 'xml2js'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { Document } from '@langchain/core/documents'
import { load } from 'cheerio'
import logger from '../config/logger.js'

async function getUrlsFromSitemap(sitemapUrl) {
    try {
        const response = await fetch(sitemapUrl)
        const xml = await response.text()
        const result = await parseStringPromise(xml)
        const urls = result.urlset.url.map(url => url.loc[0])
        // TODO: Remove slice.
        const filteredUrls = urls.filter(url => !/\d+\.\d+(-\w+)?/.test(url) && !url.includes('api')).slice(0, 1)
        logger.count(`URLs [#]: ${filteredUrls.length}`)
        return filteredUrls
    } catch (e) {
        console.error('Error fetching or parsing sitemap:', e.message)
    }
}

async function scrapeTextFromUrl(url) {
    try {
        const response = await fetch(url)
        const html = await response.text()
        const $ = load(html)
        const paragraphs = $('p').map((i, el) => $(el).text().trim()).get()
        const textString = paragraphs.join('\n')
        logger.single(`String length: ${textString.length}`)
        return textString
    } catch (e) {
        console.error('Error scraping text from URL:', e.message)
    }
}

async function chunkText(text, url) {
    try {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        })
        return await splitter.splitDocuments([
            new Document({
                pageContent: text,
                metadata: {source: url}
            })
        ])
    } catch (e) {
        console.error('Error splitting text:', e.message)
    }
}

async function formatTextFromChunk(chunk) {
    const text = chunk.pageContent
    const source = chunk.metadata.source
    return `Context: ${text}; \nSource: ${source}`
}

export async function initializeData(urls, sitemapUrl = null) {
    // TODO: Handle response when no URLs are found.
    if (sitemapUrl) {
        urls = await getUrlsFromSitemap(sitemapUrl)
    }
    const formattedChunkPromises = urls.map(async (url, index) => {
        logger.process(`Processing URL [${index + 1}/${urls.length}]: ${url}`)
        const text = await scrapeTextFromUrl(url)
        const chunks = await chunkText(text, url)
        return await Promise.all(chunks.map(chunk => formatTextFromChunk(chunk)))
    })
    const formattedChunksArray = await Promise.all(formattedChunkPromises)
    const formattedChunks = formattedChunksArray.flat()
    logger.count(`Chunks [#]: ${formattedChunks.length}`)
    return formattedChunks.slice(0, 10)
}

// Only for testing purposes for smaller code snippets.
export async function testFunctions() {
    // const urls = await getUrlsFromSitemap(sitemapUrl)
    // const scrapedText = await scrapeTextFromUrl(urls[0])
    // const chunks = await chunkText(scrapedText, urls[0])
    // console.log(chunks[0].pageContent)
    // const formattedChunk = await formatTextFromChunk(chunks[0])
    // console.log(formattedChunk)
    initializeData()
}