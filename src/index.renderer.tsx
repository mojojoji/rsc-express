import express from 'express';

/* @ts-expect-error No types for package */
import ReactServerDomWebpack from 'react-server-dom-webpack/client.edge';
import { renderToPipeableStream } from 'react-dom/server';

const app = express();
const port = 3001;

app.get('/', async (req, res) => {
	const fetchResponse = fetch('http://localhost:3000');
	const result = await ReactServerDomWebpack.createFromFetch(fetchResponse, {
		ssrManifest: {},
	});
	const { pipe } = renderToPipeableStream(result);
	pipe(res);
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
