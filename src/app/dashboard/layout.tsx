import "./styles/style.css";
import NavBar from "./components/NavBar";
import QueryCtProvider from "./components/client/QueryCtProvider";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryCtProvider>
        <header>
          <NavBar />
        </header>
        <main className='dashboard relative sm:ml-10 md:ml-40 px-2   '>{children}</main>
      </QueryCtProvider>
    </>
  );
}
