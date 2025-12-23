import { ArrowRight, HandHeart, Users, Scale, Link as LinkIcon, Sparkles, Workflow, Target } from 'lucide-react'
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

export default function About() {
  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Values */}
      <Section id="values" title="Our Core Values" className="pt-8">
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
      <Section id="how" title="How USN Works" className="py-8">
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

      {/* CTA */}
      <Section id="cta" className="py-8">
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
