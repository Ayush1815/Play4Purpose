import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PrivacyPage() {
  const lastUpdated = '23 April 2026'

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-extrabold text-[#1E1B4B] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Privacy Policy
          </h1>
          <p className="text-gray-500 mb-12">Last updated: {lastUpdated}</p>

          <div className="prose prose-purple max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">1. Introduction</h2>
              <p>
                At Play4Purpose, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">2. The Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Identity Data:</strong> includes first name, last name, and username.</li>
                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                <li><strong>Financial Data:</strong> includes payment card details (processed securely via Razorpay).</li>
                <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of subscriptions you have purchased from us.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                <li><strong>Usage Data:</strong> includes information about how you use our website and services, including golf scores submitted.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">3. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>To register you as a new customer.</li>
                <li>To process and deliver your subscription and manage payments.</li>
                <li>To manage our relationship with you, including notifying you about draw results.</li>
                <li>To enable you to partake in monthly draws and contribute to charities.</li>
                <li>To improve our website, services, and user experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">5. Your Legal Rights</h2>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, or to object to processing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:privacy@play4purpose.com" className="text-purple-600 font-semibold underline">privacy@play4purpose.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
