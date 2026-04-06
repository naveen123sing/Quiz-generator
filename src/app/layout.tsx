import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from './Provider';

export const metadata: Metadata = {
  title: "AI Quiz Generator",
  description: "Generate AI-powered quizzes from your study notes and PDF files",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}