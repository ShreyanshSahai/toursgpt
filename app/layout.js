import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata = {
    title: "ToursGPT",
    description: "GPT for Tours: Find must-visit places in any city instantly!",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en" data-theme="garden">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <ToastContainer
                        position="top-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss={false}
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                    {children}
                    <ToastContainer />
                </body>
            </html>
        </ClerkProvider>
    );
}
