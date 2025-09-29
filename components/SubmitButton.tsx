'use client'

import React, { useState } from 'react'

interface SubmitButtonProps {
  children: React.ReactNode
  className?: string
  type?: 'submit' | 'button'
  completedText?: string
  completedIcon?: string
  onClick?: () => void
}

export default function SubmitButton({ 
  children, 
  className = '', 
  type = 'submit',
  completedText = '완료',
  completedIcon = '✓',
  onClick
}: SubmitButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)

  const handleClick = () => {
    setIsCompleted(true)
    
    // onClick 이벤트가 있으면 실행
    if (onClick) {
      onClick()
    }
    
    // 3초 후 원래 상태로 복원
    setTimeout(() => {
      setIsCompleted(false)
    }, 3000)
  }

  if (isCompleted) {
    return (
      <button
        type="button"
        disabled
        className={`${className} opacity-90 cursor-not-allowed`}
      >
        <span className="flex items-center justify-center gap-1">
          {completedIcon} {completedText}
        </span>
      </button>
    )
  }

  return (
    <button
      type={type}
      className={className}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}