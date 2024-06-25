import express, { Request, Response } from 'express';
import { App } from './components/App.js';
import { rsc, respondRsc } from './lib/index.js';

const app = express();
const port = 3000;

/* @ts-expect-error */
app.get('/', rsc(<App index={1} />));

/* @ts-expect-error */
app.get('/test', (req, res) => respondRsc(req, res, <App path={req.path} index={2} />));

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
