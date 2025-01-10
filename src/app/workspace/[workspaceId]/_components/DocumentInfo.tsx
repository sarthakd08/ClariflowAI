"use client"

import CoverPicker from '@/app/_components/CoverPicker'
import { Doc } from '@/app/_shared/sharedTypes'
import { db } from '@/config/firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
    documentInfo: Doc
}

const DocumentInfo = ({documentInfo}: Props) => {
    
    const [workspaceCoverImage, setWorkspaceCoverImage] = useState('');
    const [documentName, setDocumentName] = useState('')

    useEffect(() => {
        console.log('%%% documentInfo ', documentInfo);
        if(documentInfo) {
            setDocumentName(documentInfo.documentName);
            if(documentInfo.coverImage){
                setWorkspaceCoverImage(documentInfo.coverImage);
            }
        }
        
    }, [documentInfo])

    const onDocNameChange = (e: any) => {
        setDocumentName(e.target.value)
    }

    const updateDocumentInfo = async (key: string, value: any) => {
        const docRef = doc(db, 'workspaceDocuments', documentInfo.id);
        await updateDoc(docRef, {
            [key] : value
        })
        toast('Document Updated!')
    }

  return (
    <div>
        {/* Doc header */}
        <CoverPicker setCoverImage={(imgUrl) => { setWorkspaceCoverImage(imgUrl); updateDocumentInfo('coverImage', imgUrl)}}>
            <div>
                <div className='relative group cursor-pointer bg-slate-400'>
                    <h2 className='absolute w-full h-full flex items-center justify-center text-beige font-bold text-white group-hover:text-black'>Change Cover</h2>
                    <div className='group-hover:opacity-40'>
                        <Image src={workspaceCoverImage} alt='' width={400} height={400} 
                            className='w-full h-[250px] object-cover rounded-t-xl'
                        />
                    </div>
                </div>
            </div>
        </CoverPicker>

        {/* Doc Name */}
        <div className='p-4 md:mt-10 md:ml-20 md:p-10'>
            <input 
                type='text'
                placeholder='Untitled Document'
                // defaultValue={'Untitled Document'}
                value={documentName}
                onChange={onDocNameChange}
                onBlur={(e) => {updateDocumentInfo('documentName', e.target.value)}}
                className='font-bold text-4xl outline-none w-full'
            />
        </div>
    </div>
  )
}

export default DocumentInfo