import React, { useEffect } from 'react'
import SideNav from './_components/SideNav'

type Props = {
    params: any
}

const WorkSpace = ({params}: Props) => {

  return (
    <div>
        {/* Sidenav */}
            <SideNav params={params} />
        
        {/* document */}
        <div className='md:ml-72'>
            Work Space 
        </div>
    
    </div>
  )
}

export default WorkSpace