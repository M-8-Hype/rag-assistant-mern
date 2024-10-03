import { createLogger, format, transports } from 'winston'

const { colorize, combine, timestamp, label, printf } = format
const customFormat = printf(({ level, message, label, timestamp }) => {
    return `--- [${timestamp}] ${label} [${level.toUpperCase()}] ---\n${message}`;
})

const logger = createLogger({
    level: 'info',
    format: combine(
        label({ label: 'TESTING' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
    ),
    transports: [
        new transports.Console(),
    ]
})

export default logger