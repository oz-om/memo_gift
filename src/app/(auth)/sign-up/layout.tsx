import { Metadata } from "next";
import "../styles/style.css";
export const metadata: Metadata = {
  title: "sign-in",
  description: "sign-in and start sharing love with your nearest peoples, te be together for ever",
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='auth'>
      <div className='container'>{children}</div>
    </main>
  );
}
