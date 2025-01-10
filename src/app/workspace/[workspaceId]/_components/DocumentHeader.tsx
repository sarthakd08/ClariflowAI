import { Button } from '@/components/ui/button'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const DocumentHeader = (props: Props) => {
  return (
    <div className='flex justify-between items-center shadow-lg p-3 px-4'>
        <div></div>

        <OrganizationSwitcher />

        <div className='flex gap-4'>
            <Button>Share</Button>
            <UserButton />

        </div>
    </div>
  )
}

export default DocumentHeader