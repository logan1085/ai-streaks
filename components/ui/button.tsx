import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  asChild?: boolean
}

export function Button({ 
  className, 
  variant = 'default', 
  size = 'default', 
  asChild = false,
  children,
  ...props 
}: ButtonProps) {
  const buttonClasses = cn(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'disabled:opacity-50 disabled:pointer-events-none',
    {
      'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
      'border border-input hover:bg-secondary hover:text-secondary-foreground': variant === 'outline',
      'hover:bg-secondary hover:text-secondary-foreground': variant === 'ghost',
    },
    {
      'h-10 py-2 px-4': size === 'default',
      'h-9 px-3': size === 'sm',
      'h-11 px-8': size === 'lg',
    },
    className
  )

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      className: cn(buttonClasses, (children.props as any).className),
    } as any)
  }

  return (
    <button
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  )
} 