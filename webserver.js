/*
* Copyright Brad Hermanson 2026
*
* This file is part of Aletheia.
*
* Aletheia is free software: you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License as published by the
* Free Software Foundation, either version 3 of the License, or (at your
* option) any later version.
*
* Aletheia is distributed in the hope that it will be useful, but WITHOUT ANY
* WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
* details.
*
* You should have received a copy of the GNU Affero General Public License along
* with Aletheia. If not, see <https://www.gnu.org/licenses/agpl-3.0.en.html>.
*/

const http = require('http');
const { exec } = require('child_process');
const fs = require("fs");
const readline = require("readline");
const path = require("path");
const os = require("os");
const url = require('url');
const home = os.homedir();
const { execFile } = require("child_process");

lastIntPipeData = '';
titleData = '';
queueText = '';
posText = '';
pauseText = '';
cover_art = '';

const ALETHEIA_DATA_DIR = '.'
const BLANK = `${ALETHEIA_DATA_DIR}/blank.jpg.art`;

const aletheiaDir = path.join(os.homedir(), '.aletheia-mobile');
let FIFO_PATH = "";

try {
	const files = fs.readdirSync(aletheiaDir);
	const pipeFile = files.find(f => f.startsWith('web_client_pipe'));

	if (pipeFile) {
		FIFO_PATH = path.join(aletheiaDir, pipeFile);
	} else {
		console.error("Could not find a file starting with web_client_pipe in ~/.aletheia-mobile");
	}
} catch (err) {
	console.error("Error reading ~/.aletheia-mobile directory:", err);
}

const commandMap = {
    "/execute-command-next": "n",
    "/execute-command-back": "b",
    "/execute-command-pause": "p",
    "/execute-command-voice": "d",
    "/execute-command-quit": "qy",
    "/execute-command-volumeup": "9",
    "/execute-command-volumedown": "8",
    "/execute-command-forward": "l",
    "/execute-command-backward": "h",
    "/execute-command-fadedown": "3j",
    "/execute-command-intdown": "j",
    "/execute-command-intup": "k",
    "/execute-command-45edo": "y",
    "/execute-command-doubleedo": "o",
    "/execute-command-zeroint": "yY",
    "/execute-command-savedint": "w",
    "/execute-command-music": "i^1",
    "/execute-command-sound": "i^2",
    "/execute-command-sort": "A",
    "/execute-command-shuffle": "R",
    "/execute-command-delete": "Dy",
    "/execute-command-loopartist": "V",
    "/execute-command-loopsong": "e",
    "/execute-command-onlylocked": "$",
    "/execute-command-restart": "\\",
    "/execute-command-defaultint": "tY",
    "/execute-command-togglelock": "x",
    "/execute-command-180edo": "yoo",
    "/execute-command-360edo": "yooo",
    "/execute-command-nextartist": "N",
    "/execute-command-repeat": "!",
    "/execute-command-startplus": "1",
    "/execute-command-startminus": "2",
    "/execute-command-endplus": "3",
    "/execute-command-endminus": "6",
    "/execute-command-ends": "O",
    "/execute-command-saverepeat": "#",
    "/execute-command-nextrepeat": "?",
    "/execute-command-startpos": "5",
    "/execute-command-endpos": "7",
    "/execute-command-back_from_repeat": "\x11",
    "/execute-command-gapminus": "<",
    "/execute-command-gapplus": ">",
    "/execute-command-repeatonly": "\x05",
    "/execute-command-back": "b",
    "/execute-command-scale": "u",
    "/execute-command-scalestop": "\x11",
    "/execute-command-goback": "\x1b",
    "/execute-command-reset": "4",
    "/execute-command-STARTPLUS": "G",
    "/execute-command-ENDMINUS": "H",
    "/execute-command-desktop": ":w",
    "/execute-command-toggleunlock": "X",
    "/execute-command-swaplock": "f",
    "/execute-command-add_downloaded": "W",
    "/execute-command-jump_downloaded": "\x0e",
    "/execute-command-rename": "r",
    "/execute-command-mute": "M",
    "/execute-command-morebass": "B",
    "/execute-command-lessbass": "L",
    "/execute-command-stop": "F",
    "/execute-command-halfedo": "m",
    "/execute-command-load_sounds": "S",
    "/execute-command-load_music": "P",
    "/execute-command-coverart": "C",
    "/execute-command-sleep": "Y",
    "/execute-command-hold": "z",
    "/execute-command-bass_up": "+b+",
    "/execute-command-bass_down": "+b-",
    "/execute-command-mid_up": "+m+",
    "/execute-command-mid_down": "+m-",
    "/execute-command-treb_up": "+t+",
    "/execute-command-treb_down": "+t-",
    "/execute-command-reset_eq": "%",
    "/execute-command-eq_page": "E",
    "/execute-command-main_screen": "0",
    "/execute-command-unhook": "&",
    "/execute-command-queue_down": "i",
    "/execute-command-queue_up": "I",
    "/execute-command-loop_page": "Q",
    "/execute-command-time_down": "v",
    "/execute-command-time_up": "V",
    "/execute-command-showint": "t",
    "/execute-command-togglefade": "_",
    "/execute-command-togglelight": "(",
    "/execute-command-toggledark": ")",
    "/execute-command-queue_subtract": "-",
    "/execute-command-speak_title": ",",
    "/execute-command-language_change": "a",
    "/execute-command-voice_engine_alt": "g"
};

const server = http.createServer((req, res) => {
	if (req.url === "/index.html" || req.url === "/") {
		const filePath = path.join(__dirname, "index.html");
		fs.readFile(filePath, (error, content) => {
			if (error) {
				res.writeHead(500);
				res.end(`Error loading index.html: ${error}`);
			} else {
				res.writeHead(200, { "Content-Type": "text/html" });
				res.end(content, "utf-8");
			}
		});
	} else if (req.url.startsWith("/theme")) {
		const filePath = path.join(__dirname, req.url);
		fs.readFile(filePath, (error, content) => {
			if (error) {
				res.writeHead(500);
				res.end(`Error loading ${req.url}: ${error}`);
			} else {
				res.writeHead(200, { "Content-Type": "text/css" });
				res.end(content, "utf-8");
			}
		});
	} else if (req.url.startsWith("/icons/cover.jpg")) {
		//let urlStr = req.url;
		//let zIndex = urlStr.indexOf('?');
		//if (zIndex !== -1) {
		//	urlStr = urlStr.substring(0, zIndex);
		//}
		//const filePath = path.join(__dirname, urlStr);
		const filePath = cover_art;
		const extname = String(path.extname(filePath)).toLowerCase();
		const mimeTypes = {
			'.jpg': 'image/jpg',
			'.png': 'image/png',
			'.ico': 'image/x-icon',
			'.svg': 'image/svg+xml'
		};

		const contentType = mimeTypes[extname] || 'application/octet-stream';

		fs.readFile(filePath, (error, content) => {
			if (error) {
				res.writeHead(500);
				res.end(`Error loading ${req.url}: ${error}`);
			} else {
				res.writeHead(200, { "Content-Type": contentType });
				res.end(content);
			}
		});
	} else if (req.url.startsWith("/icons/") || req.url === "/aletheia-mobile.svg") {
		let urlStr = req.url;
		let zIndex = urlStr.indexOf('?');
		if (zIndex !== -1) {
			urlStr = urlStr.substring(0, zIndex);
		}
		const filePath = path.join(__dirname, urlStr);
		const extname = String(path.extname(filePath)).toLowerCase();
		const mimeTypes = {
			'.jpg': 'image/jpg',
			'.png': 'image/png',
			'.ico': 'image/x-icon',
			'.svg': 'image/svg+xml'
		};

		const contentType = mimeTypes[extname] || 'application/octet-stream';

		fs.readFile(filePath, (error, content) => {
			if (error) {
				res.writeHead(500);
				res.end(`Error loading ${req.url}: ${error}`);
			} else {
				res.writeHead(200, { "Content-Type": contentType });
				res.end(content);
			}
		});
	} else if (commandMap[req.url]) {
		const rawChar = commandMap[req.url];

		fs.appendFile(FIFO_PATH, rawChar, (err) => {
			if (err) {
				res.writeHead(500);
				res.end("Error sending to Aletheia");
			} else {
				res.writeHead(200);
				res.end("Success");
			}
		});
	} else if (req.url === "/get-int-pipe-data") {
		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end(lastIntPipeData);
	} else if (req.url === "/get-title-pipe-data") {
		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end(titleData);
	} else if (req.url === "/get-queue-pipe-data") {
		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end(queueText);
	} else if (req.url === "/get-pos-pipe-data") {
		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end(posText);
	} else if (req.url === "/get-pause-pipe-data") {
		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end(pauseText);
	} else if (req.url === "/execute-search" && req.method === "POST") {
		let body = "";
		req.on("data", chunk => (body += chunk.toString()));
		req.on("end", () => {
			const params = new URLSearchParams(body);
			const keyword = (params.get("commandString") || "").trim();
			const rawChar = `s${keyword}\n\n`;

			fs.appendFile(FIFO_PATH, rawChar, (err) => {
				if (err) {
					res.writeHead(500);
					res.end("Error sending to Aletheia");
				} else {
					res.writeHead(200);
					res.end("Success");
				}
			});
		});
	} else {
		res.writeHead(404);
		res.end("Page not found");
	}
});

async function readLinesFromNamedPipe(pipePath) {
	try {
		const fileStream = fs.createReadStream(pipePath);
		const rl = readline.createInterface({
			input: fileStream,
			crlfCrLF: true
		});

		for await (const line of rl) {
			lastIntPipeData = `${line}`;
		}

		console.log('Finished reading from the named pipe.');
	} catch (error) {
		console.error(`Error reading from the named pipe: ${error}`);
	}
}

async function readLinesFromNamedPipeQueue(pipePath) {
	try {
		const fileStream = fs.createReadStream(pipePath);
		const rl = readline.createInterface({
			input: fileStream,
			crlfCrLF: true
		});

		for await (const line of rl) {
			const formattedData = line.replace(/\\n/g, "\n");
			queueText = `${formattedData}`;
		}

		console.log('Finished reading from the named pipe.');
	} catch (error) {
		console.error(`Error reading from the named pipe: ${error}`);
	}
}

async function readLinesFromNamedPipePos(pipePath) {
	try {
		const fileStream = fs.createReadStream(pipePath);
		const rl = readline.createInterface({
			input: fileStream,
			crlfCrLF: true
		});

		for await (const line of rl) {
			posText = `${line}`;
		}

		console.log('Finished reading from the named pipe.');
	} catch (error) {
		console.error(`Error reading from the named pipe: ${error}`);
	}
}

async function readLinesFromNamedPipePause(pipePath) {
	try {
		const fileStream = fs.createReadStream(pipePath);
		const rl = readline.createInterface({
			input: fileStream,
			crlfCrLF: true
		});

		for await (const line of rl) {
			const parts = line.split('/');
			const p0 = parts[0];
			const p1 = parts[1];
			const p2 = `${parts.slice(2).join('/')}.art`;

			if (p0 !== undefined && (p0 === '0' || p0 === '1')) {
				pauseText = p0;
			}
			cover_art = p2;

			//try {
			//	await path.existsSync(cover_art);
			//} catch (error) {
			//	cover_art = `${BLANK}`;
			//}
			if (! fs.existsSync(cover_art)) {
				cover_art = `${BLANK}`;
			}

			const pos = Number(p1);
			if (p1 !== undefined && Number.isFinite(pos) && pos >= 0 && pos <= 100) {
				posText = p1;
			}
		}

		console.log('Finished reading from the named pipe.');
	} catch (error) {
		console.error(`Error reading from the named pipe: ${error}`);
	}
}

const pipeName = `${home}/.aletheia-mobile/int_pipe`;
const queuePipeName = `${home}/.aletheia-mobile/queue_pipe`;
const posPipeName = `${home}/.aletheia-mobile/pos_pipe`;
const pausePipeName = `${home}/.aletheia-mobile/pause_pipe`;
const titleName = `${home}/.aletheia-mobile/title_pipe`;

readLinesFromNamedPipe(pipeName);
readLinesFromNamedPipeQueue(queuePipeName);
readLinesFromNamedPipePause(pausePipeName);

server.listen(1111, '127.0.0.1', () => {
	console.log('Connect to http://localhost:1111/');
});
