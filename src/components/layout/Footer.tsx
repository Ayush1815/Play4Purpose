import Link from 'next/link'
import { Target, MessageSquare, Camera, Briefcase, Mail, Phone } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Monthly Draws', href: '/#draws' },
    { label: 'Featured Charities', href: '/#charities' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Refund Policy', href: '/refunds' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0F0A1E] text-white">
      <div className="container-custom py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Play4Purpose
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Every golf score you enter contributes to causes that matter. Play smarter, win rewards, create impact.
            </p>
            {/* Contact */}
            <div className="flex flex-col gap-2">
              <a
                href="mailto:hello@play4purpose.com"
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 text-sm transition-colors"
              >
                <Mail size={14} />
                hello@play4purpose.com
              </a>
              <a
                href="tel:+911234567890"
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 text-sm transition-colors"
              >
                <Phone size={14} />
                +91 12345 67890
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm text-white mb-4">{category}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 pt-10 mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-lg mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Stay in the loop
              </h3>
              <p className="text-gray-400 text-sm">Get draw results, charity updates, and winner stories.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" id="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="submit"
                className="btn-primary py-2.5 px-5 text-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Play4Purpose. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com/play4purpose"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-purple-600 flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <MessageSquare size={14} />
            </a>
            <a
              href="https://instagram.com/play4purpose"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-purple-600 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Camera size={14} />
            </a>
            <a
              href="https://linkedin.com/company/play4purpose"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-purple-600 flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <Briefcase size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
