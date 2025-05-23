import React from 'react';
import "./globals.css";
import { SessionProvider } from './components/SessionProvider';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'DuolinGang',
  description: 'DuolinGang',
};

export default function Layout({ children }) {
  return (
    <html lang="zh">
      <body className="flex flex-col h-[90vh] bg-white bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:19px_19px]">
        <SessionProvider>
          <Navbar />
          <main className="flex flex-col mb-11 justify-center items-center flex-grow text-center gap-5">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
