'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'

interface TooltipProps {
  children: ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export default function Tooltip({ children, content, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [finalPosition, setFinalPosition] = useState(position)
  const [customOffset, setCustomOffset] = useState({ x: 0, y: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Adjust position to ensure tooltip is fully visible
  useEffect(() => {
    if (isVisible && tooltipRef.current && containerRef.current) {
      const tooltip = tooltipRef.current
      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()
      
      let newPosition = position
      let offset = { x: 0, y: 0 }
      
      // Check if tooltip would go off-screen and adjust position
      if (position === 'top') {
        if (rect.top < tooltipRect.height + 20) {
          newPosition = 'bottom'
        }
        // Check left edge - if too close to left, shift right
        if (rect.left + rect.width/2 - tooltipRect.width/2 < 20) {
          offset.x = 20 - (rect.left + rect.width/2 - tooltipRect.width/2)
        }
        // Check right edge - if too close to right, shift left
        if (rect.left + rect.width/2 + tooltipRect.width/2 > window.innerWidth - 20) {
          offset.x = window.innerWidth - 20 - (rect.left + rect.width/2 + tooltipRect.width/2)
        }
      } else if (position === 'bottom') {
        if (rect.bottom + tooltipRect.height + 20 > window.innerHeight) {
          newPosition = 'top'
        }
        // Check left edge
        if (rect.left + rect.width/2 - tooltipRect.width/2 < 20) {
          offset.x = 20 - (rect.left + rect.width/2 - tooltipRect.width/2)
        }
        // Check right edge
        if (rect.left + rect.width/2 + tooltipRect.width/2 > window.innerWidth - 20) {
          offset.x = window.innerWidth - 20 - (rect.left + rect.width/2 + tooltipRect.width/2)
        }
      } else if (position === 'left') {
        if (rect.left < tooltipRect.width + 20) {
          newPosition = 'right'
        }
      } else if (position === 'right') {
        if (rect.right + tooltipRect.width + 20 > window.innerWidth) {
          newPosition = 'left'
        }
      }
      
      // Special handling for very left-aligned elements (like hide button)
      if (rect.left < 100) {
        // Force right alignment for left-edge elements
        if (newPosition === 'top' || newPosition === 'bottom') {
          offset.x = Math.max(0, 100 - rect.left)
        }
      }
      
      // Special handling for very right-aligned elements
      if (rect.right > window.innerWidth - 100) {
        // Force left alignment for right-edge elements
        if (newPosition === 'top' || newPosition === 'bottom') {
          offset.x = Math.min(0, window.innerWidth - 100 - rect.right)
        }
      }
      
      // Final safety check - ensure tooltip is never cut off
      const finalLeft = rect.left + rect.width/2 + offset.x
      if (finalLeft - tooltipRect.width/2 < 10) {
        offset.x += 10 - (finalLeft - tooltipRect.width/2)
      }
      if (finalLeft + tooltipRect.width/2 > window.innerWidth - 10) {
        offset.x -= (finalLeft + tooltipRect.width/2) - (window.innerWidth - 10)
      }
      
      setFinalPosition(newPosition)
      setCustomOffset(offset)
    }
  }, [isVisible, position])

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-3'
  }

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-white/20',
    bottom: 'bottom-full left-1/2 transform -translate-y-1/2 border-b-white/20',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-white/20',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-white/20'
  }

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {/* Tooltip */}
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`absolute z-[70] ${positionClasses[finalPosition]}`}
          style={{
            transform: `translate(-50%, 0) translateX(${customOffset.x}px)`,
            left: finalPosition === 'left' || finalPosition === 'right' ? 'auto' : '50%',
            minWidth: 'max-content',
            maxWidth: '300px'
          }}
        >
          <div className="bg-black/95 backdrop-blur-md border border-white/40 rounded-lg px-4 py-2.5 text-white text-sm whitespace-nowrap shadow-2xl">
            {content}
            {/* Arrow */}
            <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[finalPosition]}`}></div>
          </div>
        </div>
      )}
    </div>
  )
}
