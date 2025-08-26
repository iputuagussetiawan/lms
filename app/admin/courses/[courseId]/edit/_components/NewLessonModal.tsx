import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { lessonSchema, lessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createLesson } from "../action";
import { toast } from "sonner";

export function NewLessonModal({courseId, chapterId}:{courseId:string,chapterId:string}){
    const [isOpen,setIsOpen] = useState(false);
    const [pending, startTransition] = useTransition();

    const form = useForm<lessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: "",
            courseId: courseId,
            chapterId: chapterId
        },
    })

    async function onSubmit(values:lessonSchemaType) {
        startTransition(async() => {
            const {data:result, error} =await tryCatch(createLesson(values))
            if(error){
                toast.error("An unexpected error occurred. Please try again later.");
                return;
            }

            if(result.status==='success'){
                toast.success(result.message);
                form.reset();
                setIsOpen(false);
            }else if(result.status==='error'){
                toast.error(result.message);
            }
        })
    }
    function handleOpenChange(open: boolean) {
        setIsOpen(open);

        if(!open){
            form.reset();
        }
    }
    return(
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="gap-1 w-full justify-center "><Plus className="h-4 w-4"/> New Lesson</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Lesson</DialogTitle>
                    <DialogDescription>What would you like to call this lesson?</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Lesson Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button  
                                type="submit"
                                disabled={pending}
                            >
                                {
                                    pending ?"Saving..." :"Save Change"
                                }
                                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}