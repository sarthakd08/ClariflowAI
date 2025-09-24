"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { useUser } from '@clerk/nextjs';
import { Doc } from '@/app/_shared/sharedTypes';
import GenerateAITemplate from './GenerateAITemplate';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { useStorage, useMutation } from '@liveblocks/react/suspense';
import { LiveObject } from '@liveblocks/client';

type Props = {
    documentInfo: Doc
};

const RealTimeDocumentEditor = ({documentInfo}: Props) => {
  const ref = useRef<any>(null);
  const docDetailsRef = useRef<Doc | null>(null);
  const { user } = useUser();
  const [isFetched, setIsFetched] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>('');

  // Liveblocks storage for real-time collaboration
  const documentContent = useStorage((root) => root.documentContent);
  
  const updateDocumentContent = useMutation(({ storage }, newContent) => {
    storage.set('documentContent', new LiveObject(newContent));
  }, []);

  useEffect(() => {
    initEditor();
    return () => {
      if (ref.current) {
        ref.current.destroy();
        ref.current = null;
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    docDetailsRef.current = documentInfo;
    if(docDetailsRef.current && isEditorReady) {
        getDocumentDetails()
    }
  }, [documentInfo, user, isFetched, isEditorReady]);

  // Listen to real-time changes and update editor (only when not typing)
  useEffect(() => {
    if (documentContent && isEditorReady && ref.current && !isTyping) {
      const now = Date.now();
      // Only update if content is different and enough time has passed since last update
      if (now - lastUpdateTime > 1000) {
        ref.current.save().then((currentData: any) => {
          const currentDataString = JSON.stringify(currentData);
          const liveDataString = JSON.stringify(documentContent);
          
          // Only update if content is actually different and user is not actively typing
          if (currentDataString !== liveDataString && currentDataString !== lastSavedContentRef.current) {
            console.log('Updating editor with remote changes');
            ref.current?.render(documentContent);
            setLastUpdateTime(now);
          }
        });
      }
    }
  }, [documentContent, isEditorReady, isTyping, lastUpdateTime]);

  const getDocumentDetails = async () => {
    if(docDetailsRef.current && docDetailsRef.current.id) {
        const currentDocDetails = docDetailsRef.current;
        const firebaseDocRef = doc(db, 'DocumentOutput', currentDocDetails.id)
        const docSnap = await getDoc(firebaseDocRef)

        console.log('### current Doc Details output', docSnap.data());
        if(docSnap.data()?.editedBy !== user?.primaryEmailAddress?.emailAddress || !isFetched) {
            console.log('#### Loading document from Firebase');
            if(docSnap.data()?.output) {
                try {
                    const parsedOutput = JSON.parse(docSnap.data()?.output);
                    ref.current?.render(parsedOutput);
                    // Also update Liveblocks storage
                    updateDocumentContent(parsedOutput);
                } catch (error) {
                    console.error('Error parsing document output:', error);
                }
            }
            setIsFetched(true);
        }
    }
  }

  const saveDocument = useCallback(() => {
    if (!ref.current) {
      console.error("Editor instance is not initialized.");
      return;
    }
  
    const currentDocDetails = docDetailsRef.current;
    if (!currentDocDetails || !currentDocDetails.id) {
      console.error("Document ID is missing.");
      return;
    }
  
    ref.current.save().then(async (outputData: any) => {
      try {
        const outputString = JSON.stringify(outputData);
        
        // Only save if content has actually changed
        if (outputString !== lastSavedContentRef.current) {
          console.log(`### saving for doc ${currentDocDetails.id} now`);
          
          // Update reference to prevent unnecessary saves
          lastSavedContentRef.current = outputString;
          
          // Update Liveblocks for real-time sync
          updateDocumentContent(outputData);
          
          // Also save to Firebase for persistence (debounced)
          const docRef = doc(db, 'DocumentOutput', currentDocDetails.id);
          await updateDoc(docRef, {
            output: outputString,
            editedBy: user?.primaryEmailAddress?.emailAddress || 'Unknown User',
          });
    
          console.log('Document updated successfully');
        }
      } catch (error) {
        console.error('Error updating document:', error);
      }
    }).catch((error: any) => {
      console.error('Error saving editor data:', error);
    });
  }, [updateDocumentContent, user]);

  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveDocument();
      setIsTyping(false); // User stopped typing
    }, 2000); // 2 second debounce
  }, [saveDocument]);

  const initEditor = async () => {
    if (!ref.current && typeof window !== 'undefined') {
      try {
        // Ensure we're in the browser environment
        const EditorJSClass = (await import('@editorjs/editorjs')).default;
        const HeaderTool = (await import('@editorjs/header')).default;
        const DelimiterTool = (await import('@editorjs/delimiter')).default;
        const ListTool = (await import('@editorjs/list')).default;
        const TableTool = (await import('@editorjs/table')).default;
        const CodeToolImport = (await import('@editorjs/code')).default;
        const ParagraphTool = (await import('@editorjs/paragraph')).default;
        
        ref.current = new EditorJSClass({
          holder: 'editorjs',
          onChange: (api: any, event: any) => {
              console.log('Content changed - user is typing');
          
              if (!docDetailsRef.current?.id) {
                  console.warn("Document ID is missing. Save skipped.");
                  return;
              }
          
              // Mark user as typing to prevent external updates
              setIsTyping(true);
              
              // Use debounced save instead of immediate save
              debouncedSave();
          },
          onReady: () => {
            console.log('Editor is ready');
            setIsEditorReady(true);
            getDocumentDetails();
          },
          tools: {
            header: HeaderTool,
            delimiter: DelimiterTool,
            paragraph: ParagraphTool,
            table: TableTool,
            list: ListTool,
            code: {
              class: CodeToolImport,
              shortcut: 'CMD+SHIFT+P',
            },
          },
        });
      } catch (error) {
        console.error('Error initializing editor:', error);
      }
    }
  };
  
  const setTheAIGeneratedOutput = (output: any) => {
    if(output) {
      ref.current?.render(output);
      // Also update Liveblocks storage
      updateDocumentContent(output);
    }
  }

  return (
    <div>
      <div id="editorjs"></div>

      <div className='fixed bottom-10 md:ml-80 right-4 md:right-10 z-10'>
          <GenerateAITemplate setTheAIGeneratedOutput={setTheAIGeneratedOutput}/>
      </div>
    </div>
  );
};

export default RealTimeDocumentEditor;
