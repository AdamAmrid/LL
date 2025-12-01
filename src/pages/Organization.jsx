import Section from '../components/Section'
import { GitBranch, Cog, Lightbulb, ArrowRight, CheckCircle2, Users, Target, Zap } from 'lucide-react'

export default function Organization() {
  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <Section id="intro" className="pt-8">
        <div className="reveal text-center max-w-4xl mx-auto">
          <h1 className="font-mont font-extrabold text-4xl sm:text-5xl lg:text-6xl text-dark mb-4">
            How We're Organized
          </h1>
          <p className="text-xl sm:text-2xl text-orange font-semibold mb-6">
            The Dual-Board C-L Model
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-um6p border border-gray/10">
            <p className="text-lg text-gray leading-relaxed">
              We use an innovative governance structure that balances daily operations with long-term growth.
            </p>
          </div>
        </div>
      </Section>

      {/* Organizational Chart */}
      <Section id="org-chart" title="Organizational Chart" className="py-8">
        <div className="space-y-8">
          {/* Nexus Leader */}
          <div className="reveal">
            <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-orange/10 rounded-2xl p-8 shadow-um6p border-2 border-accent/20 hover:shadow-lg hover:border-accent/30 transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-sm mb-4">
                  <GitBranch className="text-accent" size={24} />
                  <span className="font-bold text-lg text-dark">NEXUS LEADER</span>
                  <span className="text-sm text-gray">(Project Lead/CEO)</span>
                </div>
                <p className="text-gray max-w-2xl">
                  Coordinates both boards and translates vision into action
                </p>
              </div>
            </div>
          </div>

          {/* Two Boards */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* LMB */}
            <div className="reveal">
              <div className="bg-secondary rounded-2xl p-8 shadow-um6p border border-gray/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Cog className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-dark">LOGICAL-METHODOLOGICAL BOARD</h3>
                    <p className="text-xs text-gray uppercase tracking-wider">(LMB)</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-dark mb-2">The Operations Team</p>
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm text-gray font-medium">Mandate:</p>
                    <p className="text-sm text-dark">Run USN's daily operations efficiently, stably, and securely</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray font-medium italic">Mindset:</p>
                    <p className="text-sm text-dark italic">"How do we make this work right now?"</p>
                  </div>
                </div>
                <div className="border-t border-gray/20 pt-4">
                  <p className="text-xs font-semibold text-gray uppercase mb-3">Responsibilities</p>
                  <ul className="space-y-2">
                    {[
                      'Managing the website backend',
                      'Monitoring help requests and offers',
                      'Performing manual matching',
                      'Handling user data with privacy',
                      'Bug fixes and maintenance'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-dark">
                        <CheckCircle2 className="text-accent mt-0.5 flex-shrink-0" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* CUB */}
            <div className="reveal">
              <div className="bg-gradient-to-br from-orange/10 to-accent/10 rounded-2xl p-8 shadow-um6p border border-orange/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Lightbulb className="text-orange" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-dark">CREATIVE-UNORTHODOX BOARD</h3>
                    <p className="text-xs text-gray uppercase tracking-wider">(CUB)</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-dark mb-2">The Growth Team</p>
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm text-gray font-medium">Mandate:</p>
                    <p className="text-sm text-dark">Focus on USN's long-term vision, disruption, and growth</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray font-medium italic">Mindset:</p>
                    <p className="text-sm text-dark italic">"How can we make this better tomorrow?"</p>
                  </div>
                </div>
                <div className="border-t border-gray/20 pt-4">
                  <p className="text-xs font-semibold text-gray uppercase mb-3">Responsibilities</p>
                  <ul className="space-y-2">
                    {[
                      'Designing outreach campaigns',
                      'Brainstorming new features',
                      'Managing partnerships',
                      'Social media and branding',
                      'Future event planning'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-dark">
                        <CheckCircle2 className="text-orange mt-0.5 flex-shrink-0" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Decision Making */}
      <Section id="decisions" title="How We Make Decisions" className="py-8">
        <div className="space-y-8">
          {/* Flow Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Daily Operations',
                flow: 'LMB decides autonomously → Nexus informed',
                color: 'accent'
              },
              {
                icon: Target,
                title: 'Growth Initiatives',
                flow: 'CUB proposes → Nexus evaluates → Implement',
                color: 'orange'
              },
              {
                icon: Users,
                title: 'Major Decisions',
                flow: 'Both boards discuss → Nexus coordinates → Consensus',
                color: 'accent'
              }
            ].map(({ icon: Icon, title, flow, color }, idx) => (
              <div key={idx} className="reveal bg-white rounded-xl p-6 shadow-um6p border border-gray/10 hover:shadow-lg hover:-translate-y-1 hover:border-accent/30 transition-all duration-300">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${
                  color === 'accent' ? 'bg-accent/10' : 'bg-orange/10'
                }`}>
                  <Icon className={color === 'accent' ? 'text-accent' : 'text-orange'} size={24} />
                </div>
                <h4 className="font-bold text-lg text-dark mb-2">{title}</h4>
                <p className="text-sm text-gray leading-relaxed">{flow}</p>
              </div>
            ))}
          </div>

          {/* Decision Table */}
          <div className="reveal bg-white rounded-2xl shadow-um6p border border-gray/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-secondary border-b border-gray/20">
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">Decision Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">Who Decides</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">Process</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray/10">
                  {[
                    { type: 'Bug fix', who: 'LMB', process: 'Immediate action' },
                    { type: 'New feature', who: 'CUB proposes, LMB evaluates', process: 'Collaborative' },
                    { type: 'Budget allocation', who: 'Nexus with board input', process: 'Full team' },
                    { type: 'Partnership', who: 'CUB leads, Nexus approves', process: 'Strategic review' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-secondary/50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-medium text-dark">{row.type}</td>
                      <td className="px-6 py-4 text-sm text-gray">{row.who}</td>
                      <td className="px-6 py-4 text-sm text-gray">{row.process}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      {/* Why Section */}
      <Section id="why" title="Why Dual-Board Governance?" className="py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: 'Efficiency', desc: 'Operations run smoothly without bottlenecks' },
            { icon: Lightbulb, title: 'Innovation', desc: 'Creative team can think long-term' },
            { icon: Target, title: 'Balance', desc: 'Prevents startup tunnel vision' }
          ].map(({ icon: Icon, title, desc }, idx) => (
            <div key={idx} className="reveal bg-white rounded-xl p-8 shadow-um6p border border-gray/10 hover:shadow-lg hover:-translate-y-2 hover:border-accent/30 transition-all duration-300 text-center">
              <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="text-accent" size={32} />
              </div>
              <h4 className="font-bold text-xl text-dark mb-3">{title}</h4>
              <p className="text-gray leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

    </div>
  )
}
