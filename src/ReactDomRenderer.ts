import { Worker } from 'worker_threads';
import { resolve } from 'path';

export type ReactRendererIncomingMessage = {
	type: 'react-server-webpack-stream';
	stream: ReadableStream;
};

export type ReactRendererOutgoingMessage = {
	type: 'react-server-dom-stream';
	stream: ReadableStream;
};

export class ReactDomRenderer {
	worker: Worker;
	constructor() {
		this.worker = new Worker(resolve(import.meta.dirname, './react-dom-renderer.worker.js'), {
			execArgv: ['--conditions', 'edge-light'],
		});
	}

	async renderToReadableStream(webpackStream: any) {
		const input: ReactRendererIncomingMessage = { type: 'react-server-webpack-stream', stream: webpackStream };
		this.worker.postMessage(input, [input.stream as any]);

		return new Promise<ReadableStream>((resolve) => {
			this.worker.on('message', async ({ type, stream: resStream }: ReactRendererOutgoingMessage) => {
				if (type === 'react-server-dom-stream') {
					resolve(resStream);
				}
			});
		});
	}
}
