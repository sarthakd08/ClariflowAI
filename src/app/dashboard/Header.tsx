"use client"

import { OrganizationSwitcher, UserButton, useAuth } from '@clerk/nextjs'
import React from 'react'
import Logo from '../_components/Logo'

type Props = {}

const Header = (props: Props) => {
  const {orgId} = useAuth();
  console.log('## orgId', orgId);
  
  return (
    <>
        <div className='flex justify-between items-center shadow-sm sm:px-10 md:px-12  lg:px-16'>
          <Logo />
          <OrganizationSwitcher />
          <UserButton />
        </div>
    </>
  )
}

export default Header