import express, { Request, Response } from 'express';
import { App } from './components/App.js';
import { rsc, respondRsc } from 'rsc-renderer';

const app = express();
const port = 3000;

app.get('/', rsc(<App index={1} />));

app.get('/test', (req, res) => respondRsc(req, res, <App path={req.path} index={2} />));

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
