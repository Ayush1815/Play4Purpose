import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Play4Purpose — Play. Win. Make an Impact.',
  description:
    'Track your golf scores, participate in monthly reward draws, and support charities that matter. Every subscription drives real change.',
  keywords: 'golf, charity, subscription, monthly draw, rewards, impact',
  openGraph: {
    title: 'Play4Purpose — Play. Win. Make an Impact.',
    description:
      'Track your golf scores, participate in monthly reward draws, and support charities that matter.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
