import Image from 'next/image'
import React from 'react'

type Props = {}

const Logo = (props: Props) => {
  return (
    <Image src={"/logo.png"}  alt='logo' width={150} height={70}/>
  )
}

export default Logo