import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin } from 'lucide-react'


const footerSections = [
  {
    title: 'About us',
    links: [
      { label: 'About USN', to: '/about' },
      { label: 'Organization', to: '/organization' },
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Contact', to: '#contact' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Request Help', to: '/request-help' },
      { label: 'Offer Help', to: '/offer-help' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Guidelines', to: '/guidelines' },
    ]
  },
  {
    title: 'Community',
    links: [
      { label: 'News & Updates', to: '/news' },
      { label: 'Success Stories', to: '/stories' },
      { label: 'Events', to: '/events' },
      { label: 'Get Involved', to: '/involve' },
    ]
  },
  {
    title: 'UM6P',
    links: [
      { label: 'UM6P Website', to: 'https://um6p.ma', external: true },
      { label: 'Student Portal', to: 'https://portal.um6p.ma', external: true },
      { label: 'Campus Info', to: '/campus' },
    ]
  },
]

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-orange font-semibold text-lg mb-4">
                {section.title}
              </h3>
              <nav aria-label={section.title} className="space-y-2">
                {section.links.map((link) => {
                  const LinkComponent = link.external ? 'a' : Link
                  const linkProps = link.external
                    ? { href: link.to, target: '_blank', rel: 'noopener noreferrer' }
                    : { to: link.to }

                  return (
                    <LinkComponent
                      key={link.label}
                      {...linkProps}
                      className="block text-white/90 hover:text-white hover:underline transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </LinkComponent>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* USN Info and Social Media */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img src="/logo.png" alt="Logo" className="h-14 sm:h-16 w-auto object-contain" />
              <div>
                <h3 className="font-mont font-extrabold text-xl mb-1">USN - UM6P Solidarity Network</h3>
                <p className="text-sm text-white/70">A Student Initiative at UM6P</p>
                <p className="text-sm text-white/70">Ben Guerir and Rabat Campuses, Morocco</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <p className="text-white/70 text-sm">
              © {new Date().getFullYear()} UM6P Solidarity Network. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
