import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/components/CartProvider"
import { LanguageProvider } from "@/context/LanguageProvider"
import Header from "@/components/Header"

export const metadata: Metadata = {
  title: "Bealtena - Traditional Ethiopian Provisions",
  description: "Bealtena Market - Authentic Ethiopian Provisions, Spices & Food",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
