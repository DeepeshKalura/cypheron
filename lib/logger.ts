const isDev = process.env.NODE_ENV === "development"

export const logger = {
    log: (...args: any[]) => {
        if (isDev) {
            console.log(...args)
        }
    },
    error: (...args: any[]) => {
        if (isDev) {
            console.error(...args)
        } else {
            // In production, you might want to send this to Sentry or similar
            // For now, we'll suppress it or log minimal info
            console.error("[Error]", args[0])
        }
    },
    warn: (...args: any[]) => {
        if (isDev) {
            console.warn(...args)
        }
    },
    info: (...args: any[]) => {
        if (isDev) {
            console.info(...args)
        }
    },
}
