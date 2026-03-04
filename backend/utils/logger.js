const winston = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');

// Prosty logger oparty na Winston – loguje do konsoli i do pliku logs/app.log
// Konsola: kolorowy, czytelny tekst
// Plik: tekst z timestampem i poziomem, również łatwy do przejrzenia
const baseFormat = winston.format.combine(
	winston.format.timestamp(),
	winston.format.errors({ stack: true })
);

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: baseFormat,
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				baseFormat,
				winston.format.colorize(),
				winston.format.printf(({ level, message, timestamp, ...meta }) => {
					const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
					return `${timestamp} [${level}]: ${message}${metaString}`;
				})
			),
		}),
		new winston.transports.File({
			filename: path.join(logDir, 'app.log'),
			maxsize: 5 * 1024 * 1024, // 5 MB
			maxFiles: 5,
			format: winston.format.combine(
				baseFormat,
				winston.format.printf(({ level, message, timestamp, ...meta }) => {
					const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta, null, 2)}` : '';
					return `${timestamp} [${level}]: ${message}${metaString}`;
				})
			),
		}),
	],
});

module.exports = logger;
