// lib/storage.ts
import fs from "fs/promises"
import path from "path"

// This simulates the Walrus Decentralized Storage behavior
// Later, we will replace 'saveToLocal' with 'uploadToWalrus'
export async function uploadToStorage(file: File, hashedFilename: string): Promise<string> {
    try {
        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Define storage path (simulating a decentralized node)
        const uploadDir = path.join(process.cwd(), "public", "uploads")

        // Ensure directory exists
        try {
            await fs.access(uploadDir)
        } catch {
            await fs.mkdir(uploadDir, { recursive: true })
        }

        // Save the file locally (In Prod: HTTP PUT to Walrus Aggregator)
        const filePath = path.join(uploadDir, hashedFilename)
        await fs.writeFile(filePath, buffer)

        console.log(`[Storage] File saved locally at: ${filePath}`)

        // Return a "Blob ID" (For local, we just use the filename)
        // In Walrus, this would be the actual Blob ID returned by the aggregator
        return `blob_${hashedFilename}`
    } catch (error) {
        console.error("[Storage] Upload failed:", error)
        throw new Error("Failed to upload data to storage")
    }
}