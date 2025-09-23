"use client"

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

type Props = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  variant?: 'smart' | 'filter' | 'dual-logo' | 'text' | 'background'
}

const Logo = ({ size = 'md', className = '', variant = 'smart' }: Props) => {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Use resolvedTheme to handle system theme detection
  const currentTheme = resolvedTheme || theme
  
  // Size configurations
  const sizeConfig = {
    sm: { width: 100, height: 47, text: 'text-xl' },
    md: { width: 150, height: 70, text: 'text-2xl' },
    lg: { width: 200, height: 93, text: 'text-3xl' }
  }
  
  const { width, height, text: textSize } = sizeConfig[size]
  
  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className={`flex items-center ${className}`} style={{ width, height }}>
        <div className="animate-pulse bg-gray-300 dark:bg-gray-600 rounded" style={{ width, height }} />
      </div>
    )
  }
  
  // Text-based logo as fallback or alternative
  if (variant === 'text') {
    return (
      <div className={`flex items-center font-bold ${textSize} ${className}`}>
        <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Clariflow
        </span>
        <span className="text-gray-800 dark:text-white ml-1">AI</span>
      </div>
    )
  }
  
  // Dual logo approach (if you have separate light/dark logos)
  if (variant === 'dual-logo') {
    return (
      <div className={`flex items-center ${className}`}>
        <Image 
          src={currentTheme === 'dark' ? "/logo-dark.png" : "/logo.png"}
          alt="ClariflowAI logo" 
          width={width} 
          height={height}
          className="transition-opacity duration-300"
          priority
          onError={() => {
            // Fallback to filter variant if dual logos don't exist
            console.warn('Logo file not found, falling back to filter variant')
          }}
        />
      </div>
    )
  }
  
  // Background approach - adds subtle background in dark mode
  if (variant === 'background') {
    return (
      <div className={`flex items-center ${className}`}>
        <div className={`transition-all duration-300 rounded-lg ${
          currentTheme === 'dark' 
            ? 'bg-white/5 backdrop-blur-sm p-2 border border-white/10' 
            : 'p-1'
        }`}>
          <Image 
            src="/logo.png"  
            alt="ClariflowAI logo" 
            width={width} 
            height={height}
            className="transition-all duration-300"
            priority
          />
        </div>
      </div>
    )
  }
  
  // Filter approach (original CSS filter method)
  if (variant === 'filter') {
    return (
      <div className={`flex items-center ${className}`}>
        <Image 
          src="/logo.png"  
          alt="ClariflowAI logo" 
          width={width} 
          height={height}
          className={`transition-all duration-300 ${
            currentTheme === 'dark' 
              ? 'brightness-0 invert filter' // Full inversion for dark mode
              : 'brightness-100'
          }`}
          priority
        />
      </div>
    )
  }
  
  // Smart logo approach - uses text in dark mode, image in light mode
  if (currentTheme === 'dark') {
    // For dark mode, use text logo to ensure perfect visibility
    return (
      <div className={`flex items-center font-bold ${textSize} ${className}`}>
        <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
          Clariflow
        </span>
        <span className="text-white ml-1">AI</span>
      </div>
    )
  }
  
  // For light mode, use the original logo
  return (
    <div className={`flex items-center ${className}`}>
      <Image 
        src="/logo.png"  
        alt="ClariflowAI logo" 
        width={width} 
        height={height}
        className="transition-all duration-300"
        priority
      />
    </div>
  )
}

export default Logo