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
        return urls.filter(url => !/\d+\.\d+(-\w+)?/.test(url) && !url.includes('api'))
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

async function splitText(text) {
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

export default async function initializeData() {
    const urls = await getUrlsFromSitemap(sitemapUrl)
    const urlChunkPromises = urls.map(async (url) => {
        const text = await scrapeTextFromUrl(url)
        return await splitText(text)
    })
    const urlChunks = await Promise.all(urlChunkPromises)
    return urlChunks.flat()
}