import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Heart, Target, Users, ShieldCheck, Zap, TrendingUp } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding overflow-hidden">
          <div className="container-custom">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-extrabold text-[#1E1B4B] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Our Mission: <span className="text-purple-600">Golf for Good.</span>
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed mb-8">
                Play4Purpose was born from a simple idea: What if the thrill of golf could be combined with a powerful engine for social change?
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#1E1B4B] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>The Play4Purpose Story</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    In 2024, we noticed a trend: golfers are passionate people who love competition, but they also want to give back to their communities. However, finding transparent, engaging ways to support charities while playing the sport they love was difficult.
                  </p>
                  <p>
                    We built Play4Purpose to bridge that gap. A platform where every score submitted is a contribution towards a better world. Where the excitement of winning a monthly draw is matched only by the impact you're making on a cause you care about.
                  </p>
                  <p>
                    Today, we're proud to support dozens of charities across India and provide a community for thousands of golfers who play with a purpose.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Target, label: 'Vision', desc: 'A world where sport drives social change.' },
                  { icon: Heart, label: 'Charity', desc: 'Over ₹25 Lakhs raised for noble causes.' },
                  { icon: Users, label: 'Community', desc: '10,000+ golfers playing for good.' },
                  { icon: ShieldCheck, label: 'Trust', desc: '100% transparent fund allocation.' }
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                        <Icon size={20} />
                      </div>
                      <h3 className="font-bold text-[#1E1B4B] mb-1">{item.label}</h3>
                      <p className="text-gray-500 text-xs">{item.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-[#1E1B4B] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Our Core Values</h2>
              <p className="text-gray-500">The principles that guide everything we do.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: 'Transparency', 
                  desc: 'We provide detailed reports on where every rupee goes, ensuring your contributions reach the intended charities.',
                  icon: ShieldCheck
                },
                { 
                  title: 'Innovation', 
                  desc: 'We constantly improve our platform and algorithms to make the draw experience fair and exciting for everyone.',
                  icon: Zap
                },
                { 
                  title: 'Impact', 
                  desc: 'We measure our success not by revenue, but by the tangible change we bring to the lives of those in need.',
                  icon: TrendingUp
                }
              ].map((value, i) => {
                const Icon = value.icon
                return (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-200">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-[#1E1B4B] mb-4">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
