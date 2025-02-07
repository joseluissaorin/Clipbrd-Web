import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
	return (
		<html lang="en" data-theme="clipbrd">
			<head>
				<link rel="icon" type="image/png" href="/favicon.png" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<Script
					async
					src={process.env.NEXT_PUBLIC_UMAMI_URL + "/script.js"}
					data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
					strategy="afterInteractive"
				/>
				<Script
					defer
					data-domain="clipbrdapp.com"
					src="https://analytics.joseluissaorin.com/js/script.js"
					strategy="afterInteractive"
				/>
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}

export const metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.clipbrdapp.com'),
	title: "Clipbrd - Your AI-Powered Study Companion",
	description: "Transform your learning experience with intelligent clipboard management",
};
