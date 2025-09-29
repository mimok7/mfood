'use client'

import React, { useState } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  completedText?: string
  completedIcon?: string
  showCompleteFeedback?: boolean
}

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  warning: 'bg-orange-600 hover:bg-orange-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  info: 'bg-purple-600 hover:bg-purple-700 text-white'
}

const sizeClasses = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
}

export default function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  completedText = '완료',
  completedIcon = '✓',
  showCompleteFeedback = true,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (showCompleteFeedback) {
      setIsCompleted(true)
      
      // 3초 후 원래 상태로 복원
      setTimeout(() => {
        setIsCompleted(false)
      }, 3000)
    }
    
    // 원래 onClick 이벤트 실행
    if (onClick) {
      onClick(e)
    }
  }

  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    font-medium rounded-md transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    shadow-sm hover:shadow-md
  `.trim()

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].join(' ')

  if (isCompleted) {
    return (
      <button
        {...props}
        disabled
        className={`${classes} opacity-90`}
      >
        <span>{completedIcon}</span>
        {completedText}
      </button>
    )
  }

  return (
    <button
      {...props}
      className={classes}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}