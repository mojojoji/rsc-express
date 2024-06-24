import express, { Request, Response } from 'express';
// import { renderToPipeableStream } from 'react-dom/server';
import { App } from './components/App.js';
import { ReactNode } from 'react';
import { PassThrough } from 'stream';

/* @ts-expect-error No types for package */
import ReactServerDomWebpack from 'react-server-dom-webpack/server.node';

const app = express();
const port = 3000;

export async function renderRscStream(request: Request, response: Response, component: ReactNode) {}

app.get('/', async (req, res) => {
	/* @ts-expect-error Async Server Component */
	const { pipe } = ReactServerDomWebpack.renderToPipeableStream(<App req={req} res={res} />);
	pipe(res);
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
