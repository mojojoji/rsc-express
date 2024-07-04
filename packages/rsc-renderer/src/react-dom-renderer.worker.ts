import { createFromReadableStream } from 'react-server-dom-webpack/client.edge';

/* @ts-expect-error No types for package */
import * as ReactDomServer from 'react-dom/server.edge';
import { parentPort } from 'node:worker_threads';
import { ReactRendererIncomingMessage, ReactRendererOutgoingMessage } from './ReactDomRenderer.js';

// const clientManifest = {
// 	'file:///Users/joji/Work/github.com/facebook/react/fixtures/flight/src/ShowMore.js': {
// 		id: 31,
// 		chunks: [900, 'static/js/client7.858b224c.chunk.js'],
// 		name: '*',
// 	},
// };

// const ssrManifest = {
// 	moduleLoading: {
// 		prefix: '/',
// 		crossOrigin: null,
// 	},
// 	moduleMap: {
// 		'31': {
// 			'*': {
// 				specifier: 'file:///Users/joji/Work/github.com/facebook/react/fixtures/flight/src/ShowMore.js',
// 				name: '*',
// 			},
// 		},
// 	},
// };

if (parentPort) {
	parentPort.postMessage({ name: 'Hello' });

	parentPort.on('message', async ({ type, stream }: ReactRendererIncomingMessage) => {
		if (type === 'react-server-webpack-stream') {
			const streamResult = createFromReadableStream(stream, {
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
