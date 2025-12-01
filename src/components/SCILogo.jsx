export default function SCILogo({ className = '', iconSize = 'w-6 h-6', showText = true }) {
  // Use actual image file - user should add sci-logo.png to public folder
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/sci-logo.png" 
        alt="School of Collective Intelligence" 
        className={`${iconSize} object-contain max-w-none`}
        loading="eager"
        onError={(e) => {
          // Fallback to SVG if image not found
          e.target.style.display = 'none'
          const fallback = e.target.nextElementSibling
          if (fallback) fallback.style.display = 'flex'
        }}
      />
      <div className="hidden flex items-center gap-2">
        <svg
          className={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6 2 4 6 4 12V18H20V12C20 6 18 2 12 2Z"
            stroke="#445577"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="8" r="2.5" stroke="#445577" strokeWidth="1.5" />
          <circle cx="9" cy="8" r="1" fill="#445577" />
          <circle cx="15" cy="8" r="2.5" stroke="#445577" strokeWidth="1.5" />
          <circle cx="15" cy="8" r="1" fill="#445577" />
          <line x1="4" y1="12" x2="8" y2="10" stroke="#445577" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4" y1="14" x2="8" y2="12" stroke="#445577" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4" y1="16" x2="8" y2="14" stroke="#445577" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="12" x2="16" y2="10" stroke="#445577" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="14" x2="16" y2="12" stroke="#445577" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="16" x2="16" y2="14" stroke="#445577" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="18" x2="10" y2="20" stroke="#445577" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="14" y1="18" x2="14" y2="20" stroke="#445577" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {showText && (
          <div className="flex flex-col leading-tight">
            <span style={{ color: '#808080' }} className="text-[10px] font-normal">School of</span>
            <span style={{ color: '#445577' }} className="text-sm font-semibold">Collective</span>
            <span style={{ color: '#808080' }} className="text-[10px] font-normal">Intelligence</span>
          </div>
        )}
      </div>
    </div>
  )
}
