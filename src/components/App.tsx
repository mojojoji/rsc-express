import { Suspense } from 'react';
import { Request, Response } from 'express';
import ClientComponent from './ClientComponent';

export async function DelayedComponent() {
	await new Promise((resolve) => setTimeout(resolve, 5000));
	return <div>Delayed component</div>;
}

export async function App({ req, res }: { req: Request; res: Response }) {
	res.cookie('cookie', 'value', { maxAge: 900000, httpOnly: true });

	return (
		<html lang="en">
			<head>
				<title>Document</title>
			</head>
			<body>
				<h1>React Page component</h1>
				<div>Path : {JSON.stringify(req.query)}</div>
				<ClientComponent />
				<Suspense fallback={<div>Loading...</div>}>
					{/* @ts-expect-error Async Server Component */}
					<DelayedComponent />
				</Suspense>
			</body>
		</html>
	);
}
