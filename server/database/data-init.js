import fetch from "node-fetch"
import { parseStringPromise } from 'xml2js'

const sitemapUrl = 'https://docs.spring.io/spring-boot/sitemap.xml'

export async function getUrlsFromSitemap() {
    try {
        const response = await fetch(sitemapUrl)
        const xml = await response.text()
        const result = await parseStringPromise(xml)
        const urls = result.urlset.url.map(url => url.loc[0])
        const filteredUrls = urls.filter(url => !/\d+\.\d+(-\w+)?/.test(url) && !url.includes('api'))
        console.log(filteredUrls)
        console.log(filteredUrls.length)
        return filteredUrls;
    } catch (e) {
        console.error('Error fetching or parsing sitemap:', e.message)
    }
}