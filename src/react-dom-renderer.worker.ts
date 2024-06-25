/* @ts-expect-error No types for package */
import ReactServerDomWebpack from 'react-server-dom-webpack/client.edge';

/* @ts-expect-error No types for package */
import * as ReactDomServer from 'react-dom/server.edge';
import { parentPort } from 'node:worker_threads';
import { ReactRendererIncomingMessage, ReactRendererOutgoingMessage } from './ReactDomRenderer.js';

if (parentPort) {
	parentPort.postMessage({ name: 'Hello' });

	parentPort.on('message', async ({ type, stream }: ReactRendererIncomingMessage) => {
		if (type === 'react-server-webpack-stream') {
			const streamResult = ReactServerDomWebpack.createFromReadableStream(stream, {
				ssrManifest: {},
			});

			const finalStream = await ReactDomServer.renderToReadableStream(streamResult);
			const output: ReactRendererOutgoingMessage = {
				type: 'react-server-dom-stream',
				stream: finalStream,
			};
			parentPort?.postMessage(output, [output.stream as any]);
		}
	});
}
