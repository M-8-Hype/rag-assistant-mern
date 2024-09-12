import fetch from 'node-fetch'
import { parseStringPromise } from 'xml2js'
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

const sitemapUrl = 'https://docs.spring.io/spring-boot/sitemap.xml'

async function getUrlsFromSitemap(sitemapUrl) {
    try {
        const response = await fetch(sitemapUrl)
        const xml = await response.text()
        const result = await parseStringPromise(xml)
        const urls = result.urlset.url.map(url => url.loc[0])
        return urls.filter(url => !/\d+\.\d+(-\w+)?/.test(url) && !url.includes('api')).slice(0,10)
    } catch (e) {
        console.error('Error fetching or parsing sitemap:', e.message)
    }
}

async function scrapeTextFromUrl(url) {
    try {
        const pTagSelector = "p"
        const loader = new CheerioWebBaseLoader(
            url,
            {
                selector: pTagSelector,
            }
        )
        return await loader.load()
    } catch (e) {
        console.error('Error scraping text from URL:', e.message)
    }
}

async function chunkText(text) {
    try {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        })
        return await splitter.splitDocuments(text)
    } catch (e) {
        console.error('Error splitting text:', e.message)
    }
}

async function formatTextFromChunk(chunk) {
    const text = chunk.pageContent
    const source = chunk.metadata.source
    return `Context: ${text}; Source: ${source}`
}

export default async function initializeData() {
    const urls = await getUrlsFromSitemap(sitemapUrl)
    const formattedChunkPromises = urls.map(async (url) => {
        const text = await scrapeTextFromUrl(url)
        const chunks = await chunkText(text)
        return await Promise.all(chunks.map(chunk => formatTextFromChunk(chunk)))
    })
    const formattedChunks = await Promise.all(formattedChunkPromises)
    return formattedChunks.flat()
}