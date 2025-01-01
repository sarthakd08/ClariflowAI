import React from 'react'
import SideNav from '../_components/SideNav';

type Props = {
  params: any
}

const WorkspaceDocumentDetails = ({params}: Props) => {
  return (
    <div>
      <SideNav params={params} />
      
      <div className='md:ml-72'>
        WorkspaceDocumentDetails
      </div>
    </div>
  )
}

export default WorkspaceDocumentDetails;