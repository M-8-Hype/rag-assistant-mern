import fetch from 'node-fetch'
import { parseStringPromise } from 'xml2js'
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

const sitemapUrl = 'https://docs.spring.io/spring-boot/sitemap.xml'

export async function getUrlsFromSitemap() {
    try {
        const response = await fetch(sitemapUrl)
        const xml = await response.text()
        const result = await parseStringPromise(xml)
        const urls = result.urlset.url.map(url => url.loc[0])
        const filteredUrls = urls.filter(url => !/\d+\.\d+(-\w+)?/.test(url) && !url.includes('api'))
        const firstTen = filteredUrls.slice(0,10)
        console.log(firstTen)
        return firstTen
    } catch (e) {
        console.error('Error fetching or parsing sitemap:', e.message)
    }
}

export async function scrapeTextFromUrl(url) {
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

export async function splitText(text) {
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