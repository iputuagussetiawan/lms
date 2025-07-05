import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";

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