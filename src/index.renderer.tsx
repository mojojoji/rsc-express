import express from 'express';
import http from 'http';

/* @ts-expect-error No types for package */
import ReactServerDomWebpack from 'react-server-dom-webpack/client.node';
import { renderToPipeableStream } from 'react-dom/server';

const app = express();
const port = 3001;

function request(options: http.RequestOptions, body: http.IncomingMessage): Promise<http.IncomingMessage> {
	return new Promise((resolve, reject) => {
		const req = http.request(options, (res) => {
			resolve(res);
		});
		req.on('error', (e) => {
			reject(e);
		});
		body.pipe(req);
	});
}

app.get('/', async (req, res) => {
	const stream = await request(
		{
			host: 'localhost',
			port: 3000,
			method: req.method,
			path: '/',
		},
		req,
	);
	const result = await ReactServerDomWebpack.createFromNodeStream(stream, {
		ssrManifest: {},
	});
	const { pipe } = renderToPipeableStream(result);
	pipe(res);
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
