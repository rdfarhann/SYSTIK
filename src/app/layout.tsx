import { AppSidebarAdmin } from "@/components/layout/app-sidebar-admin"
import "./globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "sonner" // [1] Import Toaster
import { SidebarProvider } from "@/components/ui/sidebar"

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
        {/* [2] Letakkan Toaster di sini agar bisa diakses semua komponen */}
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