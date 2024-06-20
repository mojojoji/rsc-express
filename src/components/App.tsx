import { Suspense } from 'react';

export async function DelayedComponent() {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return <div>Delayed component</div>;
}

export async function App() {
	return (
		<html lang="en">
			<head>
				<title>Document</title>
			</head>
			<body>
				<h1>Test react server component</h1>
				<Suspense fallback={<div>Loading...</div>}>
					{/* @ts-expect-error Async Server Component */}
					<DelayedComponent />
				</Suspense>
			</body>
		</html>
	);
}
