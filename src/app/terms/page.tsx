import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function TermsPage() {
  const lastUpdated = '23 April 2026'

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-extrabold text-[#1E1B4B] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Terms of Service
          </h1>
          <p className="text-gray-500 mb-12">Last updated: {lastUpdated}</p>

          <div className="prose prose-purple max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using the Play4Purpose website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">2. Subscription & Payments</h2>
              <p>
                Play4Purpose offers subscription-based services. By subscribing, you agree to pay the monthly or yearly fees as specified at the time of purchase. Subscriptions will automatically renew unless cancelled at least 24 hours before the end of the current billing cycle.
              </p>
              <p className="mt-2 text-sm italic">
                Note: Refunds are handled according to our Refund Policy. Typically, subscription fees are non-refundable once the billing period has started.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">3. Monthly Draws & Prizes</h2>
              <p>
                Participation in monthly draws is subject to having an active subscription and complying with all platform rules, including the honest submission of golf scores.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Winners are selected based on the published draw algorithm or random selection.</li>
                <li>We reserve the right to request proof of scores (e.g., screenshots of official handicap apps) before awarding prizes.</li>
                <li>Falsification of scores will lead to immediate account termination and forfeiture of any winnings.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">4. Charity Contributions</h2>
              <p>
                A portion of your subscription fee, as selected by you (10% to 50%), is allocated to your chosen charity. Play4Purpose guarantees the transfer of these funds to the respective organizations on a periodic basis, minus any applicable transaction fees.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">5. User Conduct</h2>
              <p>
                You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You are responsible for maintaining the confidentiality of your account and password.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">6. Limitation of Liability</h2>
              <p>
                Play4Purpose shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">7. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">8. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at: <a href="mailto:legal@play4purpose.com" className="text-purple-600 font-semibold underline">legal@play4purpose.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
