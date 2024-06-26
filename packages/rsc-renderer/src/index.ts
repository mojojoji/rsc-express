import http from 'http';
import { ReactDomRenderer } from './ReactDomRenderer.js';
import { ReactNode } from 'react';
import { Readable } from 'node:stream';

import { renderToReadableStream } from 'react-server-dom-webpack/server.edge';

export function rsc(component: ReactNode): (incoming: http.IncomingMessage, outgoing: http.OutgoingMessage) => void {
	return (incoming: http.IncomingMessage, outgoing: http.OutgoingMessage) => {
		respondRsc(incoming, outgoing, component);
	};
}

export async function respondRsc(
	incoming: http.IncomingMessage,
	outgoing: http.OutgoingMessage,
	component: ReactNode,
	clientManifest: any = {},
) {
	const webpackStream = renderToReadableStream(component, clientManifest);

	const acceptsHeader = incoming.headers['accept'];
	if (acceptsHeader?.includes('text/html')) {
		const reactDomRenderer = new ReactDomRenderer();
		reactDomRenderer
			.renderToReadableStream(webpackStream, { ssrManifest: clientManifest })
			.then((stream) => Readable.fromWeb(stream).pipe(outgoing));
	} else {
		Readable.fromWeb(webpackStream).pipe(outgoing);
	}
}
