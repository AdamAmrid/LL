import { BookOpen, GraduationCap, Lightbulb, Smile, Users, Globe, Heart, Target, ArrowRight } from 'lucide-react'
import Section from '../components/Section'

const supportTypes = [
  { icon: BookOpen, title: 'Academic Resources', desc: 'Books, Notes, Materials', emoji: '📚', color: 'accent' },
  { icon: GraduationCap, title: 'Tutoring & Study Help', desc: 'Peer-to-peer learning support', emoji: '👥', color: 'orange' },
  { icon: Lightbulb, title: 'Advice & Mentorship', desc: 'Guidance from experienced students', emoji: '💡', color: 'accent' },
  { icon: Smile, title: 'Emotional Support', desc: 'A caring community for everyone', emoji: '🤝', color: 'orange' },
  { icon: Users, title: 'Career Guidance', desc: 'Professional development support', emoji: '🎯', color: 'accent' },
  { icon: Globe, title: 'Cultural Integration', desc: 'Helping international students thrive', emoji: '🌍', color: 'orange' },
]

export default function About() {
  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Hero Purpose Section */}
      <Section id="purpose" className="pt-8">
        <div className="reveal text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
            <Heart className="text-accent" size={20} />
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Our Purpose</span>
          </div>
          <h1 className="font-mont font-extrabold text-4xl sm:text-5xl lg:text-6xl text-dark mb-6 leading-tight">
            Building a Culture of Solidarity
          </h1>
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-um6p border border-gray/10">
            <p className="text-lg sm:text-xl text-gray leading-relaxed max-w-3xl mx-auto">
              To create a culture of solidarity and mutual support within the UM6P student community, ensuring that every student—regardless of background or resources—can thrive academically, socially, and emotionally.
            </p>
          </div>
        </div>
      </Section>

      {/* Mission Section */}
      <Section id="mission" title="Our Mission" className="py-8">
        <div className="reveal bg-gradient-to-br from-white to-secondary rounded-2xl p-8 sm:p-10 shadow-um6p border border-gray/10">
          <p className="text-lg text-gray leading-relaxed mb-8 max-w-4xl">
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
      <Section id="support" title="What We Support" className="py-8">
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
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  color === 'accent' 
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

      {/* About This Project */}
      <Section id="context" title="About This Project" className="py-8">
        <div className="reveal bg-gradient-to-r from-accent/5 via-orange/5 to-accent/5 rounded-2xl p-8 sm:p-10 shadow-um6p border border-accent/10">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Target className="text-accent" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-dark mb-4">Leadership Lab Course Project</h3>
              <ul className="space-y-3 text-gray">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                  </div>
                  <span>School of Collective Intelligence, UM6P</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                  </div>
                  <span>Focus on positive leadership and organizational design</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                  </div>
                  <span>Building sustainable systems for student support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section id="cta" className="py-8">
        <div className="reveal bg-dark rounded-2xl p-10 sm:p-12 text-center shadow-um6p">
          <h3 className="font-mont font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Ready to Make a Difference?
          </h3>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join the UM6P Solidarity Network and help build a more supportive community
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group inline-flex items-center gap-2 px-6 py-3.5 bg-accent text-white font-semibold rounded-xl shadow-lg hover:bg-accent/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Get Involved <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            >
              Learn More <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </Section>
    </div>
  )
}
