"use client"

import { OrganizationSwitcher, UserButton, useAuth, useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import Logo from '../_components/Logo'
import Link from 'next/link'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/config/firebaseConfig'

type Props = {}

const Header = (props: Props) => {
  const {orgId} = useAuth();
  const {user} = useUser()
  console.log('## orgId', orgId);

  useEffect(() => {
    if(user) saveUserDataToDB()
  }, [user])

  // Saving a new user to DB
  const saveUserDataToDB = async () => {
    const id = user?.primaryEmailAddress?.emailAddress
    try {
      if(id){
        await setDoc( doc(db, 'Users', id), {
          name: user?.fullName,
          avatar: user?.imageUrl,
          email: user?.primaryEmailAddress?.emailAddress
        })
      }
    } catch (error) {
      console.error('Unable to save user in firebase DB');
      
    }
  }
  
  return (
    <>
        <div className=' bg-white flex justify-between items-center shadow-sm p-4 sm:px-10 md:px-12  lg:px-16'>
        <Link href={'/dashboard'}><Logo /></Link>
          <OrganizationSwitcher />
          <UserButton />
        </div>
    </>
  )
}

export default Header