// layout.tsx


import './globals.css';

export const metadata = {
	title: "HBAMC TS",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko">
			<body className="bg-gray-50 min-h-screen scale-100">{children}</body>
		</html>
	);
}
