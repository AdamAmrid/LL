export default function UM6PLogo({ className = 'h-8', showText = false }) {
  // Use actual image file - user should add um6p-logo.png to public folder
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/um6p-logo.png" 
        alt="UM6P - University Mohammed VI Polytechnic" 
        className="h-full object-contain"
        loading="eager"
        onError={(e) => {
          // Fallback to SVG if image not found
          e.target.style.display = 'none'
          const fallback = e.target.nextElementSibling
          if (fallback) fallback.style.display = 'flex'
        }}
      />
      <div className="hidden flex gap-1">
        {['U', 'M', '6', 'P'].map((letter, idx) => (
          <div
            key={idx}
            className="w-7 h-7 sm:w-8 sm:h-8 bg-[#D4A574] rounded flex items-center justify-center text-black font-bold text-sm sm:text-base shadow-sm"
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  )
}
