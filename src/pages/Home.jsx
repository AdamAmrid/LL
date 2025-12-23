import { Heart, BookOpen, GraduationCap, Lightbulb, Smile, Users, Globe, Target, ArrowRight } from 'lucide-react'
import Section from '../components/Section'
import { Link } from 'react-router-dom'

const supportTypes = [
  { icon: BookOpen, title: 'Academic Resources', desc: 'Books, Notes, Materials', emoji: '📚', color: 'accent' },
  { icon: GraduationCap, title: 'Tutoring & Study Help', desc: 'Peer-to-peer learning support', emoji: '👥', color: 'orange' },
  { icon: Lightbulb, title: 'Advice & Mentorship', desc: 'Guidance from experienced students', emoji: '💡', color: 'accent' },
  { icon: Smile, title: 'Emotional Support', desc: 'A caring community for everyone', emoji: '🤝', color: 'orange' },
  { icon: Users, title: 'Career Guidance', desc: 'Professional development support', emoji: '🎯', color: 'accent' },
  { icon: Globe, title: 'Cultural Integration', desc: 'Helping international students thrive', emoji: '🌍', color: 'orange' },
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
              <Link to="/requests" className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/90 text-dark font-semibold border border-dark/20 shadow-um6p hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-soft">Offer Help <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" /></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Purpose Section */}
      <Section id="purpose" className="py-16">
        <div className="reveal text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
            <Heart className="text-accent" size={20} />
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Our Purpose</span>
          </div>
          <h2 className="font-mont font-extrabold text-3xl sm:text-4xl lg:text-5xl text-dark mb-6 leading-tight">
            Building a Culture of Solidarity
          </h2>
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-um6p border border-gray/10">
            <p className="text-lg sm:text-xl text-gray leading-relaxed max-w-3xl mx-auto">
              To create a culture of solidarity and mutual support within the UM6P student community, ensuring that every student—regardless of background or resources—can thrive academically, socially, and emotionally.
            </p>
          </div>
        </div>
      </Section>

      {/* Mission Section */}
      <Section id="mission" title="Our Mission" className="py-16">
        <div className="reveal bg-gradient-to-br from-white to-secondary rounded-2xl p-8 sm:p-10 shadow-um6p border border-gray/10">
          <p className="text-lg text-center mx-auto text-gray leading-relaxed mb-8 max-w-4xl">
            To build and sustain a digital and human network where UM6P students can request or offer help—such as books, tutoring, advice, or emotional support—through an online platform and collaborative on-campus activities. The mission is to turn everyday acts of help into a structured, continuous system of care and cooperation.
          </p>

          {/* Mission Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[BookOpen, GraduationCap, Lightbulb, Smile].map((Icon, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-3 bg-white rounded-xl p-6 shadow-sm border border-gray/10 hover:shadow-md hover:-translate-y-1 hover:border-accent/30 transition-all duration-300 cursor-default group"
              >
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Icon className="text-accent transition-transform duration-300 group-hover:scale-110" size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* What We Support */}
      <Section id="support" title="What We Support" className="py-16">
        <p className="text-center text-gray mb-10 max-w-2xl mx-auto">
          USN provides comprehensive support across multiple dimensions of student life
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportTypes.map(({ icon: Icon, title, desc, emoji, color }, idx) => (
            <div
              key={idx}
              className="reveal bg-white rounded-xl p-6 shadow-um6p border border-gray/10 hover:shadow-lg hover:-translate-y-2 hover:border-accent/30 transition-all duration-300 cursor-default group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${color === 'accent'
                  ? 'bg-accent/10 group-hover:bg-accent/20'
                  : 'bg-orange/10 group-hover:bg-orange/20'
                  }`}>
                  <Icon className={`${color === 'accent' ? 'text-accent' : 'text-orange'} transition-transform duration-300 group-hover:scale-110`} size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-dark mb-1 flex items-center gap-2">
                    <span className="text-2xl">{emoji}</span>
                    {title}
                  </h4>
                  {desc && <p className="text-sm text-gray leading-relaxed">{desc}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
