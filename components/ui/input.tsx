import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div
        className={cn(
          'focus-within:ring-offset- flex h-10 items-center rounded-md border border-input pl-5 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring',
          className
        )}
      >
        {props.icon && (
          <div className="mr-2 text-muted-foreground">{props.icon}</div>
        )}
        <input
          type={type}
          className={cn(
            'w-full bg-background placeholder:text-muted-foreground focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
