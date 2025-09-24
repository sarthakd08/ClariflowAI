"use client"
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  workspaceList: Workspace[]
}

type Workspace = {
  id: string,
  createdBy: string,
  orgId: string,
  workspaceName: string
  workspaceCoverImage: string,
  emoji? : string,
}

const WorkspaceList = ({workspaceList}: Props) => {
  const router=useRouter();
  const OnClickWorkspaceItem=(workspace: Workspace)=>{
      // router.push('/workspace/'+workspaceId)
      router.push(`/workspace/${workspace.id}?workspaceName=${workspace.workspaceName}`)
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6'>
    {workspaceList&&workspaceList.map((workspace,index)=>(
        <div key={index} className='border shadow-xl rounded-xl
        hover:scale-105 transition-all cursor-pointer'
        onClick={()=>OnClickWorkspaceItem(workspace)}
        >
            {workspace?.workspaceCoverImage ? (
                <Image src={workspace.workspaceCoverImage} 
                width={400} height={200} alt='cover'
                className='h-[150px] object-cover rounded-t-xl'
                />
            ) : (
                <div className='h-[150px] bg-gradient-to-br from-slate-400 to-slate-600 rounded-t-xl flex items-center justify-center'>
                    <span className='text-white text-lg font-medium opacity-60'>No Cover</span>
                </div>
            )}
            <div className='p-4 rounded-b-xl'>
                <h2 className='flex gap-2'>{workspace?.emoji} {workspace.workspaceName}</h2>
            </div>
        </div>
    ))}
</div>
  )
}

export default WorkspaceList;