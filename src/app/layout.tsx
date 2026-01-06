
import "./globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SYSTIK",
  description: "Welcome to Systik App.",
  icons: "/systik.svg",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          toastOptions={{
            style: { borderRadius: '12px' },
          }}
        />
        
      </body>
    </html>
  )
}