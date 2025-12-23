import Section from '../components/Section'
import { Calendar, MapPin, Users, Image as ImageIcon } from 'lucide-react'

const upcomingActivities = [
    {
        title: 'Study Night Marathon',
        date: 'Dec 15, 2025',
        location: 'Learning Center',
        desc: 'Join us for a collective study session with snacks and peer tutors available.',
        image: '/placeholder-activity-1.jpg' // Placeholder
    },
    {
        title: 'Well-being Workshop',
        date: 'Jan 10, 2026',
        location: 'Student Center',
        desc: 'A workshop on managing stress and building resilience during exam season.',
        image: '/placeholder-activity-2.jpg' // Placeholder
    },
]

export default function Activities() {
    return (
        <div className="space-y-16 sm:space-y-20">
            {/* Hero Section */}
            <Section id="intro" className="pt-8">
                <div className="reveal text-center max-w-4xl mx-auto">
                    <h1 className="font-mont font-extrabold text-4xl sm:text-5xl lg:text-6xl text-dark mb-6">
                        Outreach Activities
                    </h1>
                    <p className="text-xl sm:text-2xl text-accent font-semibold mb-6">
                        Building Community Through Action
                    </p>
                    <div className="bg-white rounded-2xl p-8 shadow-um6p border border-gray/10">
                        <p className="text-lg text-gray leading-relaxed">
                            Discover our upcoming events and browse through moments from our past activities. Join us in making a difference!
                        </p>
                    </div>
                </div>
            </Section>

            {/* Upcoming Activities */}
            <Section id="upcoming" title="Upcoming Activities" className="py-8">
                <div className="reveal bg-white rounded-2xl p-12 shadow-um6p border border-gray/10 text-center">
                    <h3 className="font-mont font-bold text-2xl text-dark mb-4">Coming Soon</h3>
                    <p className="text-gray text-lg">
                        We are currently planning our next outreach activities. Stay tuned for updates!
                    </p>
                </div>
            </Section>

            {/* Gallery (Placeholder) */}
            <Section id="gallery" title="Activity Gallery" className="py-8">
                <div className="reveal bg-white rounded-2xl p-8 sm:p-10 shadow-um6p border border-gray/10 text-center">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="aspect-square bg-gray/5 rounded-xl flex items-center justify-center border border-gray/10 hover:bg-gray/10 transition-colors cursor-pointer">
                                <ImageIcon className="text-gray/30" size={32} />
                            </div>
                        ))}
                    </div>
                    <p className="text-gray mt-6 italic">More photos coming soon as we grow our gallery!</p>
                </div>
            </Section>
        </div>
    )
}
