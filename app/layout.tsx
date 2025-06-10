import './globals.css'
import { Inter } from 'next/font/google'
import { SupabaseProvider } from '@/components/providers/supabase-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Supabase Onboarding Demo',
  description: 'A simple landing page with onboarding flow using Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
} 