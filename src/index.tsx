import express from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import { App } from './components/App';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
	/* @ts-expect-error Async Server Component */
	const { pipe } = renderToPipeableStream(<App />, {
		bootstrapScripts: ['/main.js'],
		onShellReady() {
			res.setHeader('content-type', 'text/html');
			pipe(res);
		},
	});
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
