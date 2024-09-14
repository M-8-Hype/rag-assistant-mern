import fetch from 'node-fetch'
import { parseStringPromise } from 'xml2js'
// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { Document } from '@langchain/core/documents'
import { load } from 'cheerio'

const sitemapUrl = 'https://docs.spring.io/spring-boot/sitemap.xml'

async function getUrlsFromSitemap(sitemapUrl) {
    try {
        const response = await fetch(sitemapUrl)
        const xml = await response.text()
        const result = await parseStringPromise(xml)
        const urls = result.urlset.url.map(url => url.loc[0])
        return urls.filter(url => !/\d+\.\d+(-\w+)?/.test(url) && !url.includes('api')).slice(0,1)
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
        return paragraphs.join('\n')
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
                metadata: { source: url }
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

export async function initializeData() {
    const urls = await getUrlsFromSitemap(sitemapUrl)
    const formattedChunkPromises = urls.map(async (url) => {
        const text = await scrapeTextFromUrl(url)
        const chunks = await chunkText(text, url)
        return await Promise.all(chunks.map(chunk => formatTextFromChunk(chunk)))
    })
    const formattedChunks = await Promise.all(formattedChunkPromises)
    return formattedChunks.flat().slice(0, 10)
}

// Only for testing purposes for smaller code snippets.
export async function testFunctions() {
    const urls = await getUrlsFromSitemap(sitemapUrl)
    const scrapedText = await scrapeTextFromUrl(urls[0])
    const chunks = await chunkText(scrapedText, urls[0])
    console.log(chunks[0].pageContent)
    const formattedChunk = await formatTextFromChunk(chunks[0])
    console.log(formattedChunk)
}