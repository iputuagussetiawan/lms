"use client";

import Uploader from '@/components/file-uploader/Uploader';
import RichTextEditor from '@/components/rich-text-editor/Editor';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { tryCatch } from '@/hooks/try-catch';
import { courseCategories, courseLevels, courseSchema, courseSchemaType, courseStatus } from '@/lib/zodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PencilIcon, SparkleIcon } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form'
import slugify from 'slugify';
import { toast } from 'sonner';
import { editCourse } from '../action';
import { useRouter } from 'next/navigation';
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-course';


interface EditCourseFormProps {
    data: AdminCourseSingularType
}

export function EditCourseForm({data}: EditCourseFormProps) {
    const [isPending, startTransition] = useTransition();
    const router=useRouter()
    const form = useForm<courseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: data.title,
            description: data.description,
            fileKey: data.fileKey,
            price: data.price,
            duration:data.duration,
            level: data.level,
            category: data.category as courseSchemaType['category'],
            slug: data.slug,
            status:data.status,
            smallDescription: data.smallDescription
        },
    })
    function onSubmit(values: courseSchemaType) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)

        startTransition(async() => {
            const {data:result, error} =await tryCatch(editCourse(values, data.id))

            if(error){
                toast.error("Failed to update course");
                return;
            }

            if(result.status==="success"){
                toast.success(result.message);
                form.reset();
                router.push("/admin/courses");
            }else if(result.status==="error"){
                toast.error(result.message);
            }
        })
    }
    return (
        <Form {...form}>
            <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='flex items-end gap-4'>
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Slug</FormLabel>
                                
                                <FormControl>
                                    <Input placeholder="Slug" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="button"
                        className='w-fit'
                        onClick={()=>{
                            const titleValue=form.getValues('title')
                            const slug=slugify(titleValue)
                            const slugLowerCase=slug.toLowerCase()
                            form.setValue('slug', slugLowerCase, {shouldValidate: true})
                        }}
                    >
                        Generate Slug
                        <SparkleIcon className='ml-1' size={16}/>
                    </Button>
                </div>

                <FormField
                    control={form.control}
                    name="smallDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Small Description</FormLabel>
                            <FormControl>
                                <Textarea className='min-h-[120px]' placeholder="Small Description" {...field} />
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
                                <RichTextEditor field={field}/>
                                {/* <Textarea className='min-h-[120px]' placeholder="Description" {...field} /> */}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fileKey"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Thumbnail Image</FormLabel>
                            <FormControl>
                                <Uploader fileTypeAccepted='image' onChange={field.onChange} value={field.value}/>
                                {/* <Input placeholder="Thumbnail url" {...field} /> */}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Select Category"/>
                                                
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {courseCategories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Level</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Select Level"/>
                                                
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {courseLevels.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration (hours)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Duration" type='number' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Price" type='number' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Select Status"/>
                                                
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {courseStatus.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                <Button 
                    disabled={isPending}
                    type="submit"
                >
                    {isPending ? (
                        <>
                            Updating...
                            <Loader2 className='ml-1 h-4 w-4 animate-spin'/>
                        </>
                    ): (
                        <>
                            Update Course 
                            <PencilIcon className='ml-1' size={16}/>
                        </>
                        )
                    }
                </Button>
            </form>
        </Form>
    )
}