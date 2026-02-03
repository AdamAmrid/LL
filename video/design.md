# Design Tokens

Based on `tailwind.config.js` and `src/styles.css`.

## Colors

### Primary & Backgrounds
- **Primary (White)**: `#FFFFFF`
- **Secondary (Light Gray)**: `#F5F5F5`
- **Cream**: `#FAFAFA`
- **UM6P Grey**: `#F5F5F5`
- **Dark Text**: `#1A1A1A`

### Accents
- **Accent (UM6P Red)**: `#E63946`
- **Orange (UM6P Orange)**: `#F77F00`

### Text
- **Main Text**: `#1A1A1A`
- **Secondary Text (Gray)**: `#666666`

## Typography

### Font Families
- **Inter**: `['Inter', 'system-ui', 'sans-serif']`
- **Montserrat**: `['Montserrat', 'Inter', 'system-ui', 'sans-serif']`

## UI Elements

### Shadows
- **Soft**: `0 10px 25px -10px rgba(0, 0, 0, 0.1)`
- **UM6P**: `0 2px 8px rgba(0, 0, 0, 0.1)` (Small card shadow)
- **Route Progress**: `0 2px 6px rgba(230,57,70,0.3)`

### Radii
- **Mdx**: `12px`
- **Focus Ring**: `4px`

### Gradients
- **Route Progress**: `linear-gradient(90deg, #E63946, #F77F00)`
- **Hero Animated Background**:
    - `radial-gradient(circle at 20% 30%, rgba(230, 57, 70, 0.15) 0%, transparent 50%)`
    - `radial-gradient(circle at 80% 70%, rgba(247, 127, 0, 0.15) 0%, transparent 50%)`
    - `radial-gradient(circle at 50% 50%, rgba(26, 26, 26, 0.1) 0%, transparent 50%)`

## Patterns
- **Morocco Pattern**: `radial-gradient(circle at 20px 20px, rgba(139,115,85,0.08) 2px, transparent 2px), radial-gradient(circle at 40px 40px, rgba(139,115,85,0.06) 2px, transparent 2px)`

## Animations
- **Fade In Up**: `fadeInUp` (from `opacity: 0, translateY(12px)` to `opacity: 1, translateY(0)`)
- **Transition Timing**: `soft` (`cubic-bezier(0.22, 1, 0.36, 1)`)
