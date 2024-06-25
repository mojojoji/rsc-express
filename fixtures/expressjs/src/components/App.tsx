import { ReactNode, Suspense } from 'react';
import ClientComponent from './ClientComponent.js';

export async function DelayedComponent() {
	await new Promise((resolve) => setTimeout(resolve, 2000));
	return <div>Delayed component</div>;
}

export async function App({ index, path }: { index: number; path?: string }): Promise<ReactNode> {
	// res.cookie('cookie', 'value', { maxAge: 900000, httpOnly: true });

	return (
		<html lang="en">
			<head>
				<title>Document</title>
			</head>
			<body>
				<h1>React Page component: {index}</h1>
				<div>Path : {path ?? 'Path not passed'}</div>
				<ClientComponent />
				<Suspense fallback={<div>Loading...</div>}>
					{/* @ts-expect-error Async Server Component */}
					<DelayedComponent />
				</Suspense>
			</body>
		</html>
	);
}
