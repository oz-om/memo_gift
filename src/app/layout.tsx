import "./assets/tailwind/globals.css";
import type { Metadata } from "next";
import { REM } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import NextAuthProvider from "./components/client/NextAuthProvider";
import CartCtProvider from "./components/cart/context/CartCtProvider";

const rem = REM({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Memory Gifts",
    template: `%s | Memory Gifts`,
  },
  description: "make memories beautiful with amazing gifts",
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_APP_URL}`),
  openGraph: {
    images: "/og-image.png",
  },
};

interface LordIconProps {
  src: string;
  style?: React.CSSProperties;
  trigger?: string;
  colors?: string;
  state?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "lord-icon": React.DetailedHTMLProps<LordIconProps, HTMLElement>;
    }
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='192x192' href='/favicon-192x192.png' />
        <link rel='icon' type='image/png' sizes='512x512' href='/favicon-512x512.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />

        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
        <script src='https://cdn.lordicon.com/lordicon-1.2.0.js' defer></script>
      </head>
      <body className={"custom-scroll-bar sm:overflow-auto " + rem.className}>
        <NextAuthProvider>
          <CartCtProvider>
            <Header />
            {children}
            <Footer />
          </CartCtProvider>
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}
