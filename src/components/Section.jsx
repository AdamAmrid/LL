export default function Section({ id, title, subtitle, children, className = '' }) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {title && (
        <div className="mb-12 text-center">
          <h2 className="font-mont font-extrabold text-3xl sm:text-4xl lg:text-5xl text-dark mb-3 leading-tight">{title}</h2>
          {subtitle && <p className="text-gray text-lg sm:text-xl max-w-3xl mx-auto">{subtitle}</p>}
        </div>
      )}
      <div className="reveal">
        {children}
      </div>
    </section>
  )
}


