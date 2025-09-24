"use client"
import React, { useState, useEffect } from 'react'
import DocumentHeader from './DocumentHeader'
import DocumentInfo from './DocumentInfo'
import { usePathname } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import CollaborativeDocumentEditor from './CollaborativeDocumentEditor';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowDown01Icon, Cross, CrossIcon, MessageCircle, X } from 'lucide-react';
import { CommentBox } from './CommentBox';

type Props = {
    params: any
}

const DocumentEditorSection = ({params}: Props) => {
    const pathname = usePathname();
    const id = pathname.split('/').pop();

    const [documentInfo, setDocumentInfo] = useState<any>({})
    const [openComment, setOpenComment] = useState<boolean>(false)
useEffect(() => {
    if(id) {
        getDocumentInfo(id)
    }
}, [id]);

const getDocumentInfo = async (docId: string) => {
    if(docId) {
        const docRef = doc(db, 'workspaceDocuments', docId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()) {
            console.log('%%% docSnap', docSnap.data());
            setDocumentInfo(docSnap.data())
        }
    }
}

  return (
    <div>
        
        {/* Header */}
        <DocumentHeader />
        
        {documentInfo && (
            <>
                <DocumentInfo documentInfo={documentInfo} />
                <div className='md:grid md:grid-cols-5'>

                    <div className='p-4 lg:-ml-40 md:p-0 md:col-span-4'>
                        <CollaborativeDocumentEditor documentInfo={documentInfo} />
                    </div>
                    <div className='fixed right-10 bottom-24'>
                        <Button className='cursor-pointer' onClick={() => setOpenComment(!openComment)}>{openComment ? <X /> :<MessageCircle />}</Button>
                        {openComment && <CommentBox />}
                    </div>
                </div>

            </>
        )}
    
    </div>
  )
}

export default DocumentEditorSection