import Section from '../components/Section'
import { Users, Cog, Lightbulb } from 'lucide-react'

export default function Team() {
  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <Section id="team-hero" className="pt-8">
        <div className="reveal text-center max-w-4xl mx-auto">
          <h1 className="font-mont font-extrabold text-4xl sm:text-5xl lg:text-6xl text-dark mb-4">
            Our Team
          </h1>
          <p className="text-lg sm:text-xl text-gray max-w-2xl mx-auto">
            Meet the dedicated members of the UM6P Solidarity Network working to build a culture of mutual support
          </p>
        </div>
      </Section>

      {/* Our Team Section */}
      <Section id="team" className="py-8">
        <div className="space-y-12">
          {/* Nexus Leader */}
          <div className="reveal">
            <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-orange/10 rounded-2xl p-8 shadow-um6p border-2 border-accent/20">
              <h3 className="text-center font-bold text-2xl text-dark mb-8">Nexus Leader</h3>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src="/team/imane-bachar.jpg"
                    alt="Imane Bachar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const placeholder = e.target.nextElementSibling
                      if (placeholder) placeholder.style.display = 'flex'
                    }}
                  />
                  <div className="hidden w-32 h-32 rounded-full bg-accent/20 border-4 border-white shadow-lg items-center justify-center">
                    <Users className="text-accent" size={48} />
                  </div>
                </div>
                <h4 className="font-bold text-xl text-dark">Imane Bachar</h4>
                <p className="text-gray mt-1">Project Lead / CEO</p>
              </div>
            </div>
          </div>

          {/* Two Boards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* LMB Team */}
            <div className="reveal">
              <div className="bg-secondary rounded-2xl p-8 shadow-um6p border border-gray/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Cog className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-dark">LOGICAL-METHODOLOGICAL BOARD</h3>
                    <p className="text-xs text-gray uppercase tracking-wider">(LMB)</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Adam Amrid */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                      <img
                        src="/team/adam-amrid.jpg"
                        alt="Adam Amrid"
                        className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          const placeholder = e.target.nextElementSibling
                          if (placeholder) placeholder.style.display = 'flex'
                        }}
                      />
                      <div className="hidden w-24 h-24 rounded-full bg-accent/20 border-2 border-white shadow-md items-center justify-center">
                        <Users className="text-accent" size={32} />
                      </div>
                    </div>
                    <h4 className="font-semibold text-dark">Adam Amrid</h4>
                    <p className="text-sm text-gray">LMB Member</p>
                  </div>
                  
                  {/* Imane Badari */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                      <img
                        src="/team/imane-badari.jpg"
                        alt="Imane Badari"
                        className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          const placeholder = e.target.nextElementSibling
                          if (placeholder) placeholder.style.display = 'flex'
                        }}
                      />
                      <div className="hidden w-24 h-24 rounded-full bg-accent/20 border-2 border-white shadow-md items-center justify-center">
                        <Users className="text-accent" size={32} />
                      </div>
                    </div>
                    <h4 className="font-semibold text-dark">Imane Badari</h4>
                    <p className="text-sm text-gray">LMB Member</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CUB Team */}
            <div className="reveal">
              <div className="bg-gradient-to-br from-orange/10 to-accent/10 rounded-2xl p-8 shadow-um6p border border-orange/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Lightbulb className="text-orange" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-dark">CREATIVE-UNORTHODOX BOARD</h3>
                    <p className="text-xs text-gray uppercase tracking-wider">(CUB)</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Taha Zaamoun */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                      <img
                        src="/team/taha-zaamoun.jpg"
                        alt="Taha Zaamoun"
                        className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          const placeholder = e.target.nextElementSibling
                          if (placeholder) placeholder.style.display = 'flex'
                        }}
                      />
                      <div className="hidden w-24 h-24 rounded-full bg-orange/20 border-2 border-white shadow-md items-center justify-center">
                        <Users className="text-orange" size={32} />
                      </div>
                    </div>
                    <h4 className="font-semibold text-dark">Taha Zaamoun</h4>
                    <p className="text-sm text-gray">CUB Member</p>
                  </div>
                  
                  {/* Hafsa */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                      <img
                        src="/team/hafsa.jpg"
                        alt="Hafsa Saih"
                        className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          const placeholder = e.target.nextElementSibling
                          if (placeholder) placeholder.style.display = 'flex'
                        }}
                      />
                      <div className="hidden w-24 h-24 rounded-full bg-orange/20 border-2 border-white shadow-md items-center justify-center">
                        <Users className="text-orange" size={32} />
                      </div>
                    </div>
                    <h4 className="font-semibold text-dark">Hafsa Saih</h4>
                    <p className="text-sm text-gray">CUB Member</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

