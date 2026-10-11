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
      ? 'bg-emerald text-zinc-950 font-semibold hover:bg-emerald-light shadow-sm'
      : variant === 'amber'
      ? 'bg-amber text-zinc-950 font-bold hover:bg-amber-light shadow-sm'
      : 'bg-white/[0.06] border border-white/10 hover:border-white/20 text-text-primary hover:bg-white/[0.1]'

  return (
    <button
      className={`group relative overflow-hidden px-6 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-[0.98] cursor-pointer ${baseVariant} ${className}`}
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
