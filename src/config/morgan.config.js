import logger from "../logger.js";

export const morganFormat = ":method :url :status :response-time ms";

export const morganFnc = {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(" ")[0],
                url: message.split(" ")[1],
                status: message.split(" ")[2],
                responseTime: message.split(" ")[3],
            };

            logObject.status > 400
                ? logger.error(JSON.stringify(logObject))
                : logger.info(JSON.stringify(logObject));
        },
    },
};
