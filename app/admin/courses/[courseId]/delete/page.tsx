"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useTransition } from "react";
import { deleteCourse } from "./action";
import { useParams, useRouter } from "next/navigation";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteCourseRoute() {
    const [pending, startTransition] = useTransition();
    const {courseId}=useParams<{courseId:string}>();
    const router=useRouter()
    function onSubmit() {

        startTransition(async() => {
            const {data:result, error} =await tryCatch(deleteCourse(courseId))
            if(error){
                toast.error("An unexpected error occurred. Please try again later.");
                return;
            }
            if(result.status==="success"){
                toast.success(result.message);
                router.push("/admin/courses");
            }else if(result.status==="error"){
                toast.error(result.message);
            }
        })
    }
        
    return (
        <div className="max-w-xl mx-auto w-full">
            <Card className="mt-32">
                <CardHeader>
                    <CardTitle>Are you sure you want to delete this course?</CardTitle>
                    <CardDescription>This action a</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <Link className={buttonVariants({ variant: "outline" })} href="/admin/courses">Cancel</Link>
                    <Button 
                        variant={"destructive"} 
                        onClick={onSubmit}
                        disabled={pending}  
                    >
                        {pending? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ):(
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}