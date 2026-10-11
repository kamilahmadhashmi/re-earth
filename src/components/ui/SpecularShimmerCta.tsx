import React from 'react'

interface SpecularShimmerCtaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'emerald' | 'amber' | 'surface'
  className?: string
  shimmerColor?: string
}

export const SpecularShimmerCta: React.FC<SpecularShimmerCtaProps> = ({
  children,
  variant = 'emerald',
  className = '',
  shimmerColor = 'rgba(255, 255, 255, 0.25)',
  ...props
}) => {
  const baseVariant =
    variant === 'emerald'
      ? 'bg-emerald text-background font-semibold hover:brightness-105 shadow-emerald-glow'
      : variant === 'amber'
      ? 'bg-amber text-background font-bold hover:brightness-105 shadow-amber-glow'
      : 'bg-surface border border-white/10 hover:border-white/20 text-text-primary'

  return (
    <button
      className={`group relative overflow-hidden px-6 py-3 rounded-md text-xs tracking-wide transition-all active:scale-[0.98] cursor-pointer ${baseVariant} ${className}`}
      {...props}
    >
      {/* Specular shimmer highlight sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`
        }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  )
}

export default SpecularShimmerCta
