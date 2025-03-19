import React from 'react';
import "./globals.css";


// app/layout.js
import './globals.css'; // 引入全局 CSS，确保 Tailwind 生效

export const metadata = {
  title: 'My Next App',
  description: 'A Next.js app with global background',
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col justify-center items-center h-[90vh] text-center gap-5 bg-white bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:19px_19px]">
        {children}
      </body>
    </html>
  );
}
