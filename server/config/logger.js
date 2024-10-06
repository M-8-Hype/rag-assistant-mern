import { addColors, createLogger, format, transports } from 'winston'

const { combine, timestamp, label, printf } = format

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        process: 3,
        count: 4,
        single: 5,
        debug: 6
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'cyan',
        process: 'blue',
        count: 'grey',
        single: 'green',
        debug: 'magenta'
    }
}
addColors(customLevels.colors)
const customFormat = printf(({ level, message, label, timestamp }) => {
    return `--- [${timestamp}]${label ? ` ${label} ` : ' --- '}[${level.toUpperCase()}] ---\n${message}`;
})

const logger = createLogger({
    level: 'single',
    levels: customLevels.levels,
    format: combine(
        // label({ label: 'TESTING' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
    ),
    transports: [
        new transports.Console(),
    ]
})

export default logger