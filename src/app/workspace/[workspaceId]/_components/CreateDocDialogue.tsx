import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
    children: React.ReactNode;
    onCreateDocument: (docName:string) => void;
}

const CreateDocDialogue = ({children, onCreateDocument}: Props) => {

    const [docName, setDocName] = useState<string>('')
    

    return (
        <Dialog>
        <DialogTrigger>
            {children}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Create new document in the workpace</DialogTitle>
            <DialogDescription>
                <div className='my-4'>
                <Input
                    placeholder='New document name..' 
                    value={docName}
                    onChange={(e) => {setDocName(e.target.value)}}
                    className='w-full'
                />
                   
                </div>
            </DialogDescription>
            </DialogHeader>
    
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <DialogClose asChild className='mb-2'>
                <Button 
                    type="button"
                    disabled={!docName || docName?.length < 3}
                    onClick={() => {onCreateDocument(docName)}}
                >
                  Create Document
                </Button>
              </DialogClose>
            </DialogFooter>
        </DialogContent>
        </Dialog>
      )
}

export default CreateDocDialogue