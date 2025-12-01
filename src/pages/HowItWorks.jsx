import Section from '../components/Section'
import { Calendar, Rocket, Users, BookOpen, Share2, Handshake, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const phases = [
  {
    phase: 'Phase 1',
    title: 'Setup',
    duration: 'Weeks 1-4',
    icon: Rocket,
    color: 'accent',
    items: [
      'Team formation',
      'Website development',
      'Internal testing'
    ]
  },
  {
    phase: 'Phase 2',
    title: 'Launch & Outreach',
    duration: 'Weeks 5-7',
    icon: Sparkles,
    color: 'orange',
    items: [
      'Campus awareness campaign',
      'Poster campaign with QR codes',
      'Social media push',
      'Goal: 50 requests + 50 offers'
    ]
  },
  {
    phase: 'Phase 3',
    title: 'Future Development',
    duration: 'Ongoing',
    icon: Calendar,
    color: 'accent',
    items: [
      'Q1: "Finals Prep" textbook drive',
      'Q2: Automated matching system',
      'Q3: "Solidarity Stories" cultural event'
    ]
  }
]

const activities = [
  {
    title: 'Peer tutoring circles',
    icon: Users,
    desc: 'Active initiative supporting our community now.',
    color: 'accent'
  },
  {
    title: 'Resource sharing drive',
    icon: Share2,
    desc: 'Active initiative supporting our community now.',
    color: 'orange'
  },
  {
    title: 'Onboarding volunteers',
    icon: Handshake,
    desc: 'Active initiative supporting our community now.',
    color: 'accent'
  }
]

export default function HowItWorks() {
  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <Section id="timeline" className="pt-8">
        <div className="text-center mb-12">
          <h1 className="font-mont font-extrabold text-4xl sm:text-5xl lg:text-6xl text-dark mb-4">
            Our Journey
          </h1>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            From initial setup to future growth, see how USN is building a culture of solidarity at UM6P
          </p>
        </div>

        {/* Timeline Phases */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {phases.map((phase, idx) => {
            const Icon = phase.icon
            return (
              <div key={idx} className="reveal relative">
                {/* Connector Line */}
                {idx < phases.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-accent/30 via-orange/30 to-accent/30 z-0" style={{ width: 'calc(100% - 2rem)', transform: 'translateX(1rem)' }} aria-hidden="true" />
                )}
                
                <div className={`bg-white rounded-2xl p-8 shadow-um6p border-2 transition-all duration-300 h-full relative z-10 ${
                  phase.color === 'accent' 
                    ? 'border-accent/20 hover:border-accent/40' 
                    : 'border-orange/20 hover:border-orange/40'
                } hover:shadow-lg hover:-translate-y-2`}>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4 ${
                    phase.color === 'accent' ? 'bg-accent/10' : 'bg-orange/10'
                  }`}>
                    <Icon className={phase.color === 'accent' ? 'text-accent' : 'text-orange'} size={20} />
                    <span className="text-xs font-bold text-gray uppercase tracking-wider">{phase.phase}</span>
                  </div>
                  <h3 className="font-bold text-2xl text-dark mb-2">{phase.title}</h3>
                  <p className="text-sm text-orange font-semibold mb-6">{phase.duration}</p>
                  <ul className="space-y-3">
                    {phase.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-3 text-sm text-gray">
                        <CheckCircle2 className={`${phase.color === 'accent' ? 'text-accent' : 'text-orange'} mt-0.5 flex-shrink-0`} size={18} />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Current Activities */}
      <Section id="activities" title="Current Activities" className="py-8">
        <p className="text-center text-gray mb-8 max-w-2xl mx-auto">
          These initiatives are actively supporting our community right now
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {activities.map((activity, idx) => {
            const Icon = activity.icon
            return (
              <div key={idx} className="reveal bg-gradient-to-br from-white to-secondary rounded-2xl p-8 shadow-um6p border border-gray/10 hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                <div className={`h-14 w-14 rounded-xl flex items-center justify-center mb-4 ${
                  activity.color === 'accent' ? 'bg-accent/10' : 'bg-orange/10'
                }`}>
                  <Icon className={activity.color === 'accent' ? 'text-accent' : 'text-orange'} size={28} />
                </div>
                <h4 className="font-bold text-xl text-dark mb-3">{activity.title}</h4>
                <p className="text-gray leading-relaxed">{activity.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-accent">
                  <span>Learn more</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Get Involved CTA */}
      <Section id="involved" title="Get Involved" className="py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray mb-10 text-lg">
            Join us in building a stronger, more supportive UM6P community
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              to="#"
              onClick={(e) => e.preventDefault()}
              className="group flex flex-col items-center justify-center gap-3 px-6 py-8 bg-accent text-white rounded-2xl shadow-um6p hover:bg-accent/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <Handshake size={32} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-lg">Become a volunteer</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="#"
              onClick={(e) => e.preventDefault()}
              className="group flex flex-col items-center justify-center gap-3 px-6 py-8 bg-orange text-white rounded-2xl shadow-um6p hover:bg-orange/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <Share2 size={32} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-lg">Share resources</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="#"
              onClick={(e) => e.preventDefault()}
              className="group flex flex-col items-center justify-center gap-3 px-6 py-8 bg-white text-dark rounded-2xl shadow-um6p border-2 border-dark/10 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <Users size={32} className="text-accent group-hover:scale-110 transition-transform" />
              <span className="font-bold text-lg">Partner with us</span>
              <ArrowRight size={20} className="text-accent group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </Section>
    </div>
  )
}
