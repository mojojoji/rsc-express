import { Suspense } from 'react';
import ClientComponent from './ClientComponent.js';

export async function DelayedComponent() {
	await new Promise((resolve) => setTimeout(resolve, 2000));
	return <div>Delayed component</div>;
}

export async function App({ index, path }: { index: number; path?: string }) {
	return (
		<html lang="en">
			<head>
				<title>Document</title>
			</head>
			<body>
				<h1>React Page component: {index}</h1>
				<div>Path : {path ?? 'Path not passed'}</div>
				<div id="root"></div>
				<ClientComponent />
				<Suspense fallback={<div>Loading...</div>}>
					<DelayedComponent />
				</Suspense>
				<script type="module" src="/@vite/client"></script>
			</body>
		</html>
	);
}
