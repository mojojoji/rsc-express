declare module 'react-server-dom-webpack/server.edge' {
	export function renderToReadableStream(component: ReactNode | Promise<ReactNode>): any;
}

declare module 'react-server-dom-webpack/client.edge' {
	import type { ReadableStream } from 'node:stream/web';
	export function createFromReadableStream(stream: ReadableStream, options: any): any;
}
