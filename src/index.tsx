import { Readable } from 'node:stream';

/* @ts-expect-error No types for package */
import ReactServerDomWebpack from 'react-server-dom-webpack/server.edge';

import express from 'express';
import { App } from './components/App.js';
import { ReactDomRenderer } from './ReactDomRenderer.js';

const app = express();
const port = 3000;

const reactDomRenderer = new ReactDomRenderer();

app.get('/', async (req, res) => {
	/* @ts-expect-error Async Server Component */
	const webpackStream = await ReactServerDomWebpack.renderToReadableStream(<App req={req} res={res} />);

	let stream: ReadableStream = webpackStream;
	if (req.accepts('text/html')) {
		stream = await reactDomRenderer.renderToReadableStream(webpackStream);
	}
	Readable.fromWeb(stream as any).pipe(res);
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
