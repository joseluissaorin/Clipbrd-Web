import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

// Use versioned image filenames to completely bypass caching issues
export const metadata = {
	metadataBase: new URL('https://www.clipbrdapp.com'),
	title: 'Clipbrd - Web Clipboard App',
	description: 'Copy and paste across devices with Clipbrd - your universal clipboard in the cloud',
	openGraph: {
		images: [{ url: 'https://www.clipbrdapp.com/opengraph-image-v2.png', width: 1200, height: 630, type: 'image/png' }]
	},
	twitter: {
		images: ['https://www.clipbrdapp.com/twitter-image-v2.png']
	},
	...getSEOTags()
};

export default function RootLayout({ children }) {
	return (
		<html lang="es" data-theme="clipbrd">
			<head>
				<link rel="icon" type="image/png" href="/favicon.png" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				{/* Direct meta tags for OpenGraph images using new filenames */}
				<meta 
					property="og:image" 
					content="https://www.clipbrdapp.com/opengraph-image-v2.png" 
				/>
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="660" />
				<meta property="og:image:type" content="image/png" />
				
				{/* Direct meta tags for Twitter card using new filenames */}
				<meta 
					name="twitter:image" 
					content="https://www.clipbrdapp.com/twitter-image-v2.png" 
				/>
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
				{renderSchemaTags()}
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
