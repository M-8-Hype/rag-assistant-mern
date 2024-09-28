import { promises as fs } from 'fs'

export async function writeToFile(text, outputDir, filename) {
    const filePath = `${outputDir}/${filename}`
    console.log(filePath)
    try {
        await fs.mkdir(outputDir, { recursive: true })
        await fs.writeFile(filePath, text, 'utf-8')
        console.log(`File written to ${filePath}.`)
    } catch (e) {
        console.error(`Error writing file: ${e}`)
    }
}