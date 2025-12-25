import { useEffect, useRef } from 'react'

export default function Section({ id, title, subtitle, children, className = '' }) {
  const revealRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (revealRef.current) {
      observer.observe(revealRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id={id} className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {title && (
        <div className="mb-12 text-center">
          <h2 className="font-mont font-extrabold text-3xl sm:text-4xl lg:text-5xl text-dark mb-3 leading-tight">{title}</h2>
          {subtitle && <p className="text-gray text-lg sm:text-xl max-w-3xl mx-auto">{subtitle}</p>}
        </div>
      )}
      <div ref={revealRef} className="reveal">
        {children}
      </div>
    </section>
  )
}


