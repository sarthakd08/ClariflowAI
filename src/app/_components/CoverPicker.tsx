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
import coverPics from '../_shared/cover-pics';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type Props = {
    children: React.ReactNode;
    setCoverImage: (c:string) => void
}

const CoverPicker: React.FC<Props> = ({children, setCoverImage}) => {

    const [selectedCover, setSelectedCover] = useState('')

  return (
    <Dialog>
    <DialogTrigger className='w-full'>
        {children}
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Update Cover</DialogTitle>
        <DialogDescription>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-2'>
                {coverPics?.map((c) => 
                    <div key={c.imageUrl} 
                        onClick={() => setSelectedCover(c.imageUrl)}
                        className={`${selectedCover === c.imageUrl && 'border-primary border-2'} p-1 rounded-sm`}
                    >
                        <Image src={c.imageUrl as string} alt='cover' width={200} height={140}
                            className='h-[70px] w-full rounded-sm object-cover'
                        />
                    </div>
                )}
            </div>
        </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button 
                type="button"
                onClick={() => setCoverImage(selectedCover)}
            >
              Update
            </Button>
          </DialogClose>
        </DialogFooter>
    </DialogContent>
    </Dialog>
  )
}

export default CoverPicker