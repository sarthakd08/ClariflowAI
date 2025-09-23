"use client"

import React from 'react'
import { useAuth, useOrganization, OrganizationSwitcher } from '@clerk/nextjs'

const ModeIndicator = () => {
  const { orgId } = useAuth()
  const { organization } = useOrganization()

  const isTeamMode = !!orgId && !!organization
  
  const tooltipText = isTeamMode 
    ? "You're viewing team workspaces. Use the organization switcher to change teams or go personal."
    : "You're in personal mode. Use the organization switcher to join a team."
  
  return (
    <div className="flex items-center gap-2">
      {/* Mode Tag */}
      <div 
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          isTeamMode 
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
        }`}
        title={tooltipText}
      >
        {isTeamMode ? 'Team Mode' : 'Personal Mode'}
      </div>
      
      {/* Organization Switcher */}
      <OrganizationSwitcher />
    </div>
  )
}

export default ModeIndicator
