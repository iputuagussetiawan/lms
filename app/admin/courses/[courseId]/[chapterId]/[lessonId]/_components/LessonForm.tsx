"use client"

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson"
import Uploader from "@/components/file-uploader/Uploader";
// import RichTextEditor from "@/components/rich-text-editor/Editor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { lessonSchema, lessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateLesson } from "../actions";

interface LessonFormProps {
    data: AdminLessonType;
    chapterId: string;
    courseId: string    
}

export function LessonForm({chapterId, data, courseId}: LessonFormProps) {
    const [pending, startTransition] = useTransition();
    // 1. Define your form.
    const form = useForm<lessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: data.title,
            chapterId: chapterId,
            courseId: courseId,
            description: data.description ?? undefined,
            videoKey: data.videoKey ?? undefined,
            thumbnailKey: data.thumbnailKey ?? undefined
        },
    })

   function onSubmit(values: lessonSchemaType) {
        
          // Do something with the form values.
          // ✅ This will be type-safe and validated.
        console.log(values)

        startTransition(async() => {
            const {data:result, error} =await tryCatch(updateLesson(values, data.id))

            if(error){
                toast.error("Failed to create course");
                return;
            }

            if(result.status==="success"){
                toast.success(result.message);
            }else if(result.status==="error"){
                toast.error(result.message);
            }
        })
    }
    return (
        <div>
            <Link className={buttonVariants({ variant: 'outline', className: 'mb-6' })} href={`/admin/courses/${courseId}/edit`}>
                <ArrowLeft className='size-4'/>
                <span>Go Back</span>
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle>Lesson Configuration</CardTitle>
                    <CardDescription>Configure the video and description for this lesson</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lesson Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Lesson Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <RichTextEditor field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                            <FormField
                                control={form.control}
                                name="thumbnailKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thumbnail Image</FormLabel>
                                        <FormControl>
                                            <Uploader {...field} onChange={field.onChange} value={field.value} fileTypeAccepted="image" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="videoKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video File</FormLabel>
                                        <FormControl>
                                            <Uploader {...field} onChange={field.onChange} value={field.value} fileTypeAccepted="video" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                disabled={pending}
                                type="submit"
                            >
                                {pending ? (
                                    <>
                                        Saving...
                                        <Loader2 className='ml-1 h-4 w-4 animate-spin'/>
                                    </>
                                ): (
                                    <>
                                        Save Lesson 
                                    </>
                                    )
                                }
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}