import { Alert } from "@/components/ui/alert";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteChapter, deleteLesson } from "../action";
import { toast } from "sonner";

export function DeleteChapter({
    chapterId,
    courseId
}:{
    chapterId:string,
    courseId:string
}) {
    const [open,setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    async function onSubmit(){
        startTransition(async() => {
            const {data:result,error}=await tryCatch(
                deleteChapter({chapterId,courseId})
            );
            if(error){
                toast.error("An unexpected error occurred. Please try again later.");
                return;
            }
            if(result.status==='success'){
                toast.success(result.message);
                setOpen(false);
            }else if(result.status==='error'){
                toast.error(result.message);
            }
        })
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                    <Trash2 className="size-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the chapter.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button 
                        onClick={onSubmit}
                        disabled={pending}                    
                    >
                        {pending ? "Deleting..." : "Delete"}
                        {
                            pending && (
                                <Loader2 className="animate-spin ml-2" />
                            )
                        }
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}