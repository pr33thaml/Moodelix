'use client'

import { useState } from 'react'

interface BugReportPopupProps {
  isOpen: boolean
  onClose: () => void
  onClick?: () => void
}

export default function BugReportPopup({ isOpen, onClose, onClick }: BugReportPopupProps) {
  const [bugDescription, setBugDescription] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bugDescription.trim()) return

    setIsSubmitting(true)
    onClick?.()

    try {
      // Create bug report object
      const bugReport = {
        id: Date.now().toString(),
        description: bugDescription.trim(),
        userEmail: userEmail.trim() || 'Anonymous',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        version: '1.0.0' // You can update this
      }

      // Store in localStorage
      const existingReports = JSON.parse(localStorage.getItem('bugReports') || '[]')
      existingReports.push(bugReport)
      localStorage.setItem('bugReports', JSON.stringify(existingReports))

      // TODO: Later we'll send this to a database
      console.log('Bug report saved:', bugReport)

      setIsSubmitted(true)
      setTimeout(() => {
        onClose()
        setIsSubmitted(false)
        setBugDescription('')
        setUserEmail('')
      }, 2000)

    } catch (error) {
      console.error('Error saving bug report:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99] bg-black/20" onClick={onClose}>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/30 border border-white/20 rounded-lg p-6 min-w-[400px] max-w-[500px] z-[100] backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
        <div className="text-white text-lg font-medium mb-4">Report a Bug</div>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">Bug Description *</label>
              <textarea
                value={bugDescription}
                onChange={(e) => setBugDescription(e.target.value)}
                placeholder="Describe what went wrong, what you expected to happen, and steps to reproduce..."
                className="w-full h-32 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:border-white/40"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm mb-2">Your Email (Optional)</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              />
              <p className="text-white/60 text-xs mt-1">We'll only use this to follow up on your report</p>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !bugDescription.trim()}
                className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="text-green-400 text-6xl mb-4">✓</div>
            <div className="text-white text-lg mb-2">Bug Report Submitted!</div>
            <div className="text-white/60 text-sm">Thank you for helping improve Moodelix</div>
          </div>
        )}
      </div>
    </div>
  )
}
