import http from 'http';
import { ReactDomRenderer } from './ReactDomRenderer.js';
import { ReactNode } from 'react';
import { Readable } from 'node:stream';

/* @ts-expect-error No types for package */
import ReactServerDomWebpack from 'react-server-dom-webpack/server.edge';
export function rsc(
	component: ReactNode | Promise<ReactNode>,
): (incoming: http.IncomingMessage, outgoing: http.OutgoingMessage) => void {
	return (incoming: http.IncomingMessage, outgoing: http.OutgoingMessage) => {
		const webpackStream = ReactServerDomWebpack.renderToReadableStream(component);

		const acceptsHeader = incoming.headers['accept'];
		if (acceptsHeader?.includes('text/html')) {
			const reactDomRenderer = new ReactDomRenderer();
			reactDomRenderer
				.renderToReadableStream(webpackStream)
				.then((stream: any) => Readable.fromWeb(stream).pipe(outgoing));
		} else {
			Readable.fromWeb(webpackStream as any).pipe(outgoing);
		}
	};
}

export async function respondRsc(
	incoming: http.IncomingMessage,
	outgoing: http.OutgoingMessage,
	component: ReactNode | Promise<ReactNode>,
) {
	const webpackStream = ReactServerDomWebpack.renderToReadableStream(component);

	const acceptsHeader = incoming.headers['accept'];
	if (acceptsHeader?.includes('text/html')) {
		const reactDomRenderer = new ReactDomRenderer();
		reactDomRenderer
			.renderToReadableStream(webpackStream)
			.then((stream: any) => Readable.fromWeb(stream).pipe(outgoing));
	} else {
		Readable.fromWeb(webpackStream as any).pipe(outgoing);
	}
}
