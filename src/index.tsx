import express from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import { App } from './components/App';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
	/* @ts-expect-error Async Server Component */
	const { pipe } = renderToPipeableStream(<App req={req} res={res} />, {
		bootstrapScripts: ['/main.js'],
		onShellReady() {
			res.setHeader('content-type', 'text/html');
			pipe(res);
		},
		onShellError(error) {
			res.statusCode = 500;
			res.setHeader('content-type', 'text/html');
			res.send('<h1>Error rendering page</h1>');
		},
	});
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
