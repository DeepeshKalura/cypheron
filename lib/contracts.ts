export const PACKAGE_ID = "0x0" // TODO: Replace with actual deployed package ID
export const MODULE_NAME = "marketplace"
export const MARKETPLACE_ID = "0x0" // TODO: Replace with actual shared object ID

export const CRYPTOVAULT_MODULE = `${PACKAGE_ID}::${MODULE_NAME}`

export const CLOCK_ID = "0x6"

export type Dataset = {
    id: { id: string }
    seller: string
    title: string
    price: string
    data_hash: number[]
    zk_proof: number[]
    purchase_count: string
}
