import Section from '../components/Section'
import { Calendar, MapPin, Users, Image as ImageIcon } from 'lucide-react'

const upcomingActivities = [
    {
        title: 'Study Night Marathon',
        date: 'Feb 07, 2026',
        location: 'Learning Center',
        desc: 'Join us for a collective study session with snacks and peer tutors available.',
        image: '/activities/latenight.jpg'
    },
    {
        title: 'Well-being Workshop',
        date: 'Feb 14, 2026',
        location: 'Student Center',
        desc: 'A workshop on managing stress and building resilience during exam season.',
        image: '/activities/wellbeing.jpg'
    },
]

export default function Activities() {
    return (
        <div className="space-y-16 sm:space-y-20">
            {/* Hero Section */}
            <Section id="intro" className="pt-8">
                <div className="text-center max-w-4xl mx-auto">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {upcomingActivities.map((activity, index) => (
                        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-um6p border border-gray/10 hover:shadow-lg transition-all duration-300">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={activity.image}
                                    alt={activity.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-sm text-gray mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} className="text-accent" />
                                        <span>{activity.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={16} className="text-accent" />
                                        <span>{activity.location}</span>
                                    </div>
                                </div>
                                <h3 className="font-mont font-bold text-xl text-dark mb-2">{activity.title}</h3>
                                <p className="text-gray text-sm">{activity.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Gallery */}
            <Section id="gallery" title="Activity Gallery" className="py-8">
                <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-um6p border border-gray/10 text-center">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {['/activities/out1.jpeg', '/activities/out2.jpeg', '/activities/out3.jpeg'].map((src, index) => (
                            <div key={index} className="aspect-square rounded-xl overflow-hidden border border-gray/10 hover:shadow-md transition-all cursor-pointer group">
                                <img
                                    src={src}
                                    alt={`Activity ${index + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-gray mt-6 italic">More photos coming soon as we grow our gallery!</p>
                </div>
            </Section>
        </div>
    )
}
