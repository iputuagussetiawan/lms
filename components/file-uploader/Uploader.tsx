"use client";

import React, {useCallback, useState} from 'react'
import {FileRejection, useDropzone} from 'react-dropzone'
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from './RenderState';
import { toast } from 'sonner';
import {v4 as uuidv4} from 'uuid'

interface UploaderState{
    id:string | null,
    file:File | null,
    uploading:boolean,
    progress:number,
    key?:string,
    isDeleting?:boolean,
    error:boolean,
    objectUrl?:string,
    fileType:"image" | "video"
}

const Uploader = () => {
    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType:"image"
    });
    const onDrop = useCallback((acceptedFiles:File[]) => {
        // Do something with the files
        if(acceptedFiles.length>0) {
            const file = acceptedFiles[0];
            setFileState({
                file:file,
                uploading:false,
                progress:0,
                objectUrl:URL.createObjectURL(file),
                error:false,
                id:uuidv4(),
                isDeleting:false,
                fileType:"image"
            });
            uploadFile(file);
        }
    }, [])

    async function uploadFile(file:File) {
        setFileState((prev)=>({
            ...prev,
            uploading:true,
            progress:0
        }))

        try {
            //1. get presigned url
            const presignedResponse=await fetch('/api/s3/upload',{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    fileName:file.name,
                    contentType:file.type,
                    size:file.size,
                    isImage:true,
                }),
            });

            if(!presignedResponse.ok){
                toast.error("Failed to get presigned url");
                setFileState((prev)=>({
                    ...prev,
                    uploading:false,
                    progress:0,
                    error:true
                }))
                return;
            }

            const {presignedUrl, key} =await presignedResponse.json();

            await new Promise<void>((resolve,reject)=>{
                const xhr=new XMLHttpRequest();
                xhr.upload.onprogress=(event)=>{
                    if(event.lengthComputable){
                        const percentageCompleted=(event.loaded/event.total)*100;
                        setFileState((prev)=>({
                            ...prev,
                            progress:Math.round(percentageCompleted)
                        }))
                    }
                };
                xhr.onload=()=>{
                    if(xhr.status===200 || xhr.status===204){
                        setFileState((prev)=>({
                            ...prev,
                            progress:100,
                            uploading:false,
                            key:key
                        }));

                        toast.success("File uploaded successfully");
                        resolve();
                    }else{
                        reject(new Error("Failed to upload file"));
                    }
                }
                xhr.onerror=()=>{
                    reject(new Error("Failed to upload file"));
                }

                xhr.open("PUT", presignedUrl);
                xhr.setRequestHeader("Content-Type", file.type);
                xhr.send(file);
            });
        } catch (error) {
            toast.error("something went wrong");
            setFileState((prev)=>({
                ...prev,
                progress:0,
                error:true,
                uploading:false
            }));
        }
    }

    function rejectedFiles(fileRejection:FileRejection[]) {
        if(fileRejection.length) {
            const tooManyFiles = fileRejection.find((rejection)=> rejection.errors[0].code === "too-many-files");
            
            const fileSizeToBig= fileRejection.find((rejection)=> rejection.errors[0].code === "file-too-large");
            if(tooManyFiles){
                toast.error("You can only upload one file at a time");
            }
            if(fileSizeToBig){
                toast.error("File size is too big");
            }
        }
    }

    function renderContent(){
        if(fileState.uploading){
            return (
                <RenderUploadingState progress={fileState.progress} file={fileState.file as File}/>
            )
        }

        if(fileState.error){
            return <RenderErrorState/>
        }

        if(fileState.objectUrl){
            return (
                <RenderUploadedState previewUrl={fileState.objectUrl}/>
            )
        }

        return <RenderEmptyState isDragActive={isDragActive}/>
    }
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept:{
            'image/*':[],
        },
        maxFiles:1,
        multiple:false,
        maxSize:1*1024*1024, //1mb
        onDropRejected: rejectedFiles
    })
    return (
        <Card {...getRootProps()} className={cn("relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
            isDragActive ? "border-primary bg-primary/10 border-solid":"border-border hover:border-primary"
        )}>
            <CardContent className='flex items-center justify-center h-full w-full p-4'>
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    )
}

export default Uploader