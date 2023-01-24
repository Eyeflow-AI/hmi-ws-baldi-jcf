import fs from 'fs';
import { createStream } from 'rotating-file-stream';

import dateFormat from './dateFormat.js';
import getRequestId from './getRequestId.js';


import packageJson from '../../../package.json';
const appName = packageJson.name;

import appRoot from 'app-root-path';
const logsPath = `${appRoot}/logs/`;

const DEBUG = process.env.DEBUG;

//=====================================================================================================================

function mkdirP(dir_path) {
    if (!fs.existsSync(dir_path)) {
        console.log(`Creating directory: ${dir_path}`);
        fs.mkdirSync(dir_path, { recursive: true });
    };
};

function getFile(log_dir = logsPath) {
    mkdirP(log_dir);
    return createStream(`${appName}.log`, {
        size: "10MB", // rotate every 10 MegaBytes written
        interval: "1d", // rotate daily
        compress: "gzip", // compress rotated files
        path: "logs"
    });
};

// function getip (req) {
//     return req.ip ||
//       req._remoteAddress ||
//       (req.connection && req.connection.remoteAddress) ||
//       undefined
// }

function asctime() {
    return dateFormat(Date.now(), 'default');
};

function getReqDurationMS(start) {
    const NS_PER_SEC = 1e9; //  convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

//=====================================================================================================================

class Log {
    constructor() {
        this.__clusterMode = false;
        this.formatRequest = '[${this.asctime}] - [${this.method} - ${this.url}] - ${this.message}';
        this.formatMessage = '[${this.asctime}] - [${this.levelname}] - [${this.funcName}] - ${this.message}';
        this.formatMessage_wout_funcName = '[${this.asctime}] - [${this.levelname}] - ${this.message}';
        this.writeStream = getFile();
    }

    clusterMode(mode = false) {
        this.__clusterMode = mode;
    };
    //- Log Master --------------------------------------------------------------------------------------------------------------
    master() {
        this.writeStream = getFile();
    };

    async master_write(message) {
        this.writeStream.write(message);
    };

    //- Log Worker --------------------------------------------------------------------------------------------------------------
    //--- Message Handlers ------------------------------------------------------------------------------------------------------
    static async send_message_to_master(message) {
        process.send(message)
    };

    format_string(levelname, message, function_name) {
        let template_vars = {
            asctime: asctime(),
            funcName: function_name,
            levelname: levelname,
            message: message
        }

        return (function_name)
            ? new Function("return `" + this.formatMessage + "`;").call(template_vars)
            : new Function("return `" + this.formatMessage_wout_funcName + "`;").call(template_vars);
    };

    debug(message, function_name) {
        if (DEBUG) {
            this.message_handler('DEBUG', message, function_name);
        };
    };

    info(message, function_name) {

        this.message_handler('INFO', message, function_name);
    };

    audit(message, function_name) {

        this.message_handler('AUDIT', message, function_name);
    };

    warning(message, function_name) {

        this.message_handler('WARNING', message, function_name);
    };

    error(message, function_name) {

        this.message_handler('ERROR', message, function_name);
    };

    fatal(message, function_name) {

        this.message_handler('FATAL', message, function_name);
        this.message_handler('INFO', 'Finishing script...', 'Log.fatal');
        setTimeout(() => {
            return process.exit(1);
        }, 1000);
    };

    message_handler(levelname, message, function_name) {
        const formatted_message = this.format_string(levelname, message, function_name);
        console.log(formatted_message);
        if (this.__clusterMode) {
            Log.send_message_to_master(formatted_message + '\n');
        }
        else {
            this.writeStream.write(formatted_message + '\n');
        };
    };

    //--- Request Handlers ------------------------------------------------------------------------------------------------------
    format_request(method, url, message) {
        let template_vars = {
            asctime: asctime(),
            method: method,
            url: url,
            message: message
        };
        return new Function("return `" + this.formatRequest + "`;").call(template_vars);
    };

    request_handler(method, url, message) {
        const formatted_request = this.format_request(method, url, message);
        console.log(formatted_request);
        if (this.__clusterMode) {
            Log.send_message_to_master(formatted_request + '\n');
        }
        else {
            this.writeStream.write(formatted_request + '\n');
        };
    };

    //--- Log Middleware --------------------------------------------------------------------------------------------------------
    middleware() {

        return (req, res, next) => {
            let method = req.method;
            let url = req.url;
            let requestId = getRequestId(req);
            const start = process.hrtime();
            this.request_handler(method, url, `Request ${requestId} Start`);
            next();

            res.on("finish", () => {
                let statusCode = res.statusCode;
                let duration = getReqDurationMS(start);
                this.request_handler(method, url, `Request ${requestId} Status: ${statusCode}. Duration - ${duration} ms.`);
            });
        };
    };
};

// module.exports = new Log();
export default new Log();