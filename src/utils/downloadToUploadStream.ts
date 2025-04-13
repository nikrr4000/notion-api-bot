import axios from "axios"
import type { Readable } from "node:stream"

export default async (url: string): Promise<bucketUploadObj | null> => {
    try
    {
        const response = await axios.get<Readable>(url, { responseType: "stream" })
        const name = url.split('/').pop() as string
        const stream = response.data
        const contentLength = response.headers['content-length']

        return { name, stream, contentLength }
    } catch (error)
    {
        console.error(error)
        return null
    }
}