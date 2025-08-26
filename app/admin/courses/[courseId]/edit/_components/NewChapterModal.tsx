import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { chapterSchema, chapterSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createChapter } from "../action";
import { toast } from "sonner";

export function NewChapterModal({courseId}:{courseId:string}){
    const [isOpen,setIsOpen] = useState(false);
    const [pending, startTransition] = useTransition();

    const form = useForm<chapterSchemaType>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            name: "",
            courseId: courseId,
            
        },
    })

    async function onSubmit(values:chapterSchemaType) {
        startTransition(async() => {
            const {data:result, error} =await tryCatch(createChapter(values))
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
        if(!open) form.reset();
        setIsOpen(open);
    }
    return(
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"} size={"sm"} className="gap-2"><Plus className="h-4 w-4"/> New Chapter</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Chapter</DialogTitle>
                    <DialogDescription>What would you like to call this chapter?</DialogDescription>
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
                                        <Input placeholder="Name" {...field} />
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