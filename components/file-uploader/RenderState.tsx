import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export function RenderEmptyState({isDragActive}:{isDragActive:boolean}) {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
                <CloudUploadIcon className={cn(
                    "size-6 text-muted-foreground",
                    isDragActive && "text-primary"
                )}/>
            </div>
            <p className="text-base text-foreground">Drop your files here or <span className="text-primary font-bold cursor-pointer">click to upload</span></p>
            <Button className="mt-4" type="button">Select File</Button>
        </div>
    )
}

export function RenderErrorState(){
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
                <ImageIcon className="size-6"/>
            </div>
            <p className="text-base font-semibold">Upload Failed</p>
            <p className="text-sm mt-1 text-muted-foreground">Something went wrong. Please try again</p>
            <Button className="mt-4" type="button">Retry File Selection</Button>
        </div>
    )
}

export function RenderUploadedState({
    previewUrl,
    isDeleting,
    handleRemoveFile,
    fileType
}:{
    previewUrl:string;
    isDeleting?:boolean;
    handleRemoveFile:()=>void;
    fileType:"image" | "video";
}){
    return(
        <div className="relative group w-full h-full flex items-center justify-center">
            {fileType==='video'?(
                <video 
                    src={previewUrl} 
                    controls={true}
                    className="rounded-md w-full h-full"
                />
            ):(
                <Image 
                    src={previewUrl} 
                    fill
                    alt="uploaded file" 
                    className="object-contain p-2" 
                />
            )
            }
            <Button 
                onClick={handleRemoveFile}
                disabled={isDeleting}
                variant={"destructive"} 
                size={"icon"} 
                className={cn(
                'absolute top-4 right-4'
            )}>
                {isDeleting ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <XIcon className="size-4" />
                )}
            </Button>
        </div>
    )
}

export function RenderUploadingState({progress, file}:{progress:number, file:File}) {
    return(
        <div className="text-center flex justify-center items-center flex-col">
            <p>{progress}</p>
            <p className="mt-2 text-sm font-medium text-foreground">
                Uploading...
            </p>
            <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">{file.name}</p>
        </div>
    )
}

