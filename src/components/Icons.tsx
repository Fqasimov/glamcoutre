type IconProps = { className?: string }

export function ArrowRight({ className }: IconProps) {
  return (
    <svg className={['icon', className].filter(Boolean).join(' ')} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M3 10h13M11.5 5.5 16 10l-4.5 4.5" />
    </svg>
  )
}

export function ArrowLeft({ className }: IconProps) {
  return (
    <svg className={['icon', className].filter(Boolean).join(' ')} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M17 10H4M8.5 5.5 4 10l4.5 4.5" />
    </svg>
  )
}

export function Close({ className }: IconProps) {
  return (
    <svg className={['icon', className].filter(Boolean).join(' ')} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" />
    </svg>
  )
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg className={['icon', className].filter(Boolean).join(' ')} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M5.5 14.5l9-9M7 5.5h7.5V13" />
    </svg>
  )
}
