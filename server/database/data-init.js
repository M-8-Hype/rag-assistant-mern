import * as cheerio from 'cheerio'
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
        const onlyFirst = filteredUrls.slice(0,1)
        console.log(onlyFirst)
        return onlyFirst
    } catch (e) {
        console.error('Error fetching or parsing sitemap:', e.message)
    }
}

export async function scrapeTextFromUrl(url) {
    try {
        const response = await fetch(url)
        const html = await response.text()
        const $ = cheerio.load(html)
        const text = $('body').text().trim()
        return text
    } catch (e) {
        console.error('Error scraping text from URL:', e.message)
    }
}

export async function scrapeTextFromUrlLangchain(url) {
    try {
        const pTagSelector = "p"
        const loader = new CheerioWebBaseLoader(
            url,
            {
                selector: pTagSelector,
            }
        )
        const docs = await loader.load()
        return docs
    } catch (e) {
        console.error('Error scraping text from URL:', e.message)
    }
}

export async function splitText(docs) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    })
    const chunks = await splitter.splitDocuments(docs)
    return chunks
}