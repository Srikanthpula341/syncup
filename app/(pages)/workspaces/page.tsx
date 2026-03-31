import WorkspaceList from '@/app/components/workspaces/WorkspaceList'
import React from 'react'

export default function WorkspacePage() {
  return (
    <div className='bg-zinc-50 min-h-screen pb-32 lg:pb-0'>
      <WorkspaceList />
    </div>
  )
}