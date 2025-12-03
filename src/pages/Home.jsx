import { ArrowRight, HandHeart, Users, Scale, Link as LinkIcon, Sparkles, Workflow } from 'lucide-react'
import Section from '../components/Section'
import { Link } from 'react-router-dom'

const values = [
  { icon: HandHeart, title: 'Empathy', desc: 'Understanding and sharing the feelings of our peers' },
  { icon: Scale, title: 'Equality', desc: 'Every student matters, regardless of background' },
  { icon: Users, title: 'Cooperation', desc: 'Working together for collective success' },
  { icon: LinkIcon, title: 'Collective Responsibility', desc: 'We all have a role in supporting each other' },
]

const steps = [
  { icon: Sparkles, title: 'Request or Offer Help', desc: 'Students fill out simple forms' },
  { icon: Workflow, title: 'We Match', desc: 'Our team connects requests with offers' },
  { icon: HandHeart, title: 'Connect & Support', desc: 'Students help each other thrive' },
]

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-white relative overflow-hidden">
        {/* Video Background */}
        {/* Image Background */}
        <img
          src="/um6p-pic.png"
          alt="UM6P Campus"
          className="hero-video-bg"
        />
        {/* Fallback background if video fails */}
        <div className="hero-animated-bg-fallback" style={{ display: 'none' }} aria-hidden="true" />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/70 z-[1]" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
          <div className="reveal">
            <h1 className="font-mont font-extrabold text-4xl sm:text-6xl lg:text-7xl text-dark">UM6P Solidarity Network</h1>
            <p className="mt-4 text-lg sm:text-xl text-dark/80">Building a Culture of Mutual Support at UM6P</p>
            <p className="mt-3 text-dark/80 max-w-2xl">Every student deserves to thrive. Together, we can help each other succeed.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/request-help" className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-white font-semibold shadow-um6p hover:bg-accent/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-soft">Request Help <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" /></Link>
              <Link to="#" onClick={(e) => e.preventDefault()} className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/90 text-dark font-semibold border border-dark/20 shadow-um6p hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-soft">Offer Help <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" /></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <Section id="values" title="Our Core Values" className="py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="reveal bg-white rounded-xl p-6 shadow-um6p border border-gray/10 hover:border-accent/40 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 ease-soft cursor-default">
              <Icon className="text-accent transition-transform duration-300 group-hover:scale-110" size={28} />
              <h3 className="mt-3 font-semibold text-lg text-dark">{title}</h3>
              <p className="text-gray mt-1 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section id="how" title="How USN Works" className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {steps.map(({ icon: Icon, title, desc }, idx) => (
            <div key={title} className="reveal bg-white rounded-xl p-6 shadow-um6p border border-gray/10 relative hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-soft">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300"><Icon className="text-accent group-hover:scale-110 transition-transform duration-300" size={20} /></div>
                <h4 className="font-semibold text-dark">{title}</h4>
              </div>
              <p className="text-gray mt-2 text-sm">{desc}</p>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-accent/30" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section id="cta" className="py-16">
        <div className="reveal bg-dark/5 rounded-2xl p-8 sm:p-10 text-center shadow-um6p border border-gray/10">
          <h3 className="font-mont text-2xl sm:text-3xl font-extrabold text-dark">Ready to Join?</h3>
          <p className="text-gray mt-2">Join 100+ students building solidarity at UM6P</p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Link to="/request-help" className="px-6 py-3 rounded-xl bg-accent text-white font-semibold shadow-um6p hover:bg-accent/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-soft">I Need Help</Link>
            <Link to="#" onClick={(e) => e.preventDefault()} className="px-6 py-3 rounded-xl bg-white text-dark font-semibold border border-dark/20 shadow-um6p hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-soft">I Can Help</Link>
          </div>
        </div>
      </Section>
    </div>
  )
}
