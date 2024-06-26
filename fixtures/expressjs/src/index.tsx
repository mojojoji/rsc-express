import express, { Request, Response } from 'express';
import { App } from './components/App.js';
import { rsc, respondRsc } from 'rsc-renderer';
import { readFile } from 'fs/promises';
import { join } from 'path';

const app = express();
const port = 3000;

export async function startServer() {
	const clientManifestText = await readFile(join(import.meta.dirname, './react-client-manifest.json'), 'utf-8');
	const clientManifest = JSON.parse(clientManifestText);
	console.log('Loaded client manifest', clientManifest);

	const viteDevServer = await import('vite').then((vite) => {
		return vite.createServer({
			server: { middlewareMode: true },
			appType: 'custom',
		});
	});
	app.use(viteDevServer.middlewares);
	console.log('Added vite dev server middleware');

	app.get('/', (req, res) => respondRsc(req, res, <App path={req.path} index={1} />, clientManifest));

	app.get('/test', (req, res) => respondRsc(req, res, <App path={req.path} index={2} />, clientManifest));

	app.listen(port, () => {
		console.log(`Server is running at http://localhost:${port}`);
	});
}

startServer();
