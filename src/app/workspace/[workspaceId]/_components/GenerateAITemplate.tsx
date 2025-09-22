import { Button } from '@/components/ui/button'
import { LayoutGrid, Loader2Icon } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Textarea } from "@/components/ui/textarea"

import { chatSession } from '@/config/Google-AI-Model'

type Props = {
    setTheAIGeneratedOutput: (output: any) => void
}

const GenerateAITemplate = ({setTheAIGeneratedOutput}: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);

    const generateFromAI = async () => {
        setLoading(true);
        const PROMPT = `Generate in a format for editor.js in JSON for ${userInput}`

        try {
            const result = await chatSession.sendMessage(PROMPT);
            console.log(result.response.text());
            const output = JSON.parse(result.response.text())
            setTheAIGeneratedOutput(output);
            setUserInput('')
        } catch (error) {
            console.error('Error generating AI template:', error);
            setLoading(false);
            setUserInput('')
        }
        
        setLoading(false);
        setIsOpen(false)
    }

  return (
    <div>
        <Button  className='flex gap-2' onClick={() => setIsOpen(true)}>
            <LayoutGrid className='h-4 w-4'/>
            Generate with AI
        </Button>
        
        <div className='mx-2 text-center'>
            <Dialog open={isOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Generate with AI</DialogTitle>
                    <DialogDescription>
                        <div className='flex flex-col w-full'>
                            <h3 className='my-2'>What do you want to write in the document?</h3>
                            <Textarea
                                placeholder='Ex. write me a template for groceries shopping list..' 
                                className='my-4'
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                            />
                        </div>
                    </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button 
                            type="button" 
                            variant="secondary"
                            onClick={() => setIsOpen(false)}
                        >
                            Close
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button 
                            type="button"
                            disabled={!userInput || loading}
                            onClick={generateFromAI}
                            className='mt-4 md:mt-0'
                        >
                            {loading ? <Loader2Icon className='animate-spin'/> : 'Generate'} 
                        </Button>
                    </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </div>
  )
}

export default GenerateAITemplate