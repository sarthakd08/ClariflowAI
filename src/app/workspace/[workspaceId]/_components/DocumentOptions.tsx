import { Link2Icon, MoreVertical, PenBox, Trash2 } from 'lucide-react'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/config/firebaseConfig'
import { Doc } from '@/app/_shared/sharedTypes'

  
type Props = {
    docDetails : Doc
    deleteDocument: (docId: Doc) => void
}


const DocumentOptions = ({docDetails, deleteDocument}: Props) => {

    const onDeleteDocClick = () => {
        console.log('deleteDocument', docDetails);
        
        // await deleteDoc(doc(db, "workspaceDocuments", docDetails?.id));
        deleteDocument(docDetails);
    }

  return (
    <div>
        
        <DropdownMenu>
        <DropdownMenuTrigger>
            <MoreVertical className='h-4 w-4 text-black'/>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            
            <DropdownMenuItem className="flex gap-2"> 
            <Link2Icon className='h-4 w-4'/> Share Link</DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2"> 
            <PenBox className='h-4 w-4'/>Rename</DropdownMenuItem>
            <DropdownMenuItem 
            onClick={()=>{onDeleteDocClick()}}
            className="flex gap-2 text-red-500"> 
            <Trash2 className='h-4 w-4'/>Delete</DropdownMenuItem>
            
        </DropdownMenuContent>
        </DropdownMenu>

    </div>
  )
}

export default DocumentOptions