"use client"

import Logo from '@/app/_components/Logo'
import { Button } from '@/components/ui/button'
import { db } from '@/config/firebaseConfig'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { Bell, File } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type Props = {
    params: any
}

type Doc = {
    coverImage? : string,
    createdBy: string,
    documentName: string,
    documentOutput : any[],
    emoji?: string,
    id: string
    workspaceId: number | string,
}

const SideNav = ({params}: Props) => {
    const {workspaceId, documentId} = JSON.parse(params.value);
    const router = useRouter()
    const [documentList, setDocumentList] = useState<any[]>([]);
    
    useEffect(() => {
        console.log('## nav', params.value);
        workspaceId && getDocumentsList()
    }, [workspaceId])

    const getDocumentsList = () => {
        const q = query(collection(db, 'workspaceDocuments'), where('workspaceId', '==', Number(workspaceId)))

        const unSubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log('doc: ', doc.data());
                setDocumentList(prevList => [...prevList, doc.data()])
                
            })
        })
    }

    const onDocumentClick = (clickedDocId: string) => {
        workspaceId && clickedDocId && router.replace('/workspace/'+workspaceId+'/'+clickedDocId);
    }

    
  return (
    <div className='h-screen md:w-72 fixed bg-primary p-6 shadow-md'>
        <div className='flex justify-between mb-6'>
            <Logo />
            <Bell className="h-5 w-5 mt-2 " />
        </div>
        <hr className='mx-2'></hr>

        <div className='flex justify-between mt-4'>
            <h2 className='font-semibold text-gray-100 mt-1'>WorkSpace Name</h2>
            <Button size={'sm'} variant={'secondary'}>+</Button>
        </div>

        <div className='mt-5'>
            {documentList?.length ? documentList.map((doc: Doc, index) => (
                <div 
                    key={index} 
                    className='flex justify-start gap-2 mb-2 p-2 text-white hover:text-secondary cursor-pointer'
                    onClick={() => onDocumentClick(doc.id)}
                >
                    <File/>
                    <h2 className=''>{doc.documentName}</h2>
                </div>
            ))
                : 
                <div>
                    <h3>No Documents yet!</h3>
                </div>
            }
        </div>
    </div>
  )
}

export default SideNav