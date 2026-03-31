import BoardContainer from '@/app/components/tasks/BoardContainer'
import React, { Suspense } from 'react'

export default function TaskPage() {
  return (
    <div className='h-full'>
      <Suspense fallback={
        <div className="flex h-full items-center justify-center bg-zinc-50/30 font-medium text-zinc-400">
          Loading board...
        </div>
      }>
        <BoardContainer />
      </Suspense>
    </div>
  )
}

