"use client"
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { courseCategories, courseLevels, courseSchema, courseSchemaType, courseStatus } from '@/lib/zodSchemas'
import { ArrowLeft, Loader2, PlusIcon, SparkleIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import RichTextEditor from '@/components/rich-text-editor/Editor'
import Uploader from '@/components/file-uploader/Uploader'
import { tryCatch } from '@/hooks/try-catch'
import { CreateCourse } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useConfetti } from '@/hooks/use-confetti'

const CreateCoursePage = () => {
    const [isPending, startTransition] = useTransition();
    const router=useRouter()
    const {triggerConfetti}=useConfetti()
    // 1. Define your form.
    const form = useForm<courseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: "",
            description: "",
            fileKey: "",
            price: 0,
            duration:0,
            level: "BEGINNER",
            category: "IT & Software",
            slug: "",
            status:"DRAFT",
            smallDescription: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: courseSchemaType) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated

        startTransition(async() => {
            const {data:result, error} =await tryCatch(CreateCourse(values))

            if(error){
                toast.error("Failed to create course");
                return;
            }

            if(result.status==="success"){
                toast.success(result.message);
                triggerConfetti();
                form.reset();
                router.push("/admin/courses");
            }else if(result.status==="error"){
                toast.error(result.message);
            }
        })
    }
    
    return (
        <> 
            <div className='flex items-center gap-4'>
                <Link href='/admin/courses' className={buttonVariants({ size: 'sm', variant: 'outline' })}>
                    <ArrowLeft className='size-4'/>
                    Back
                </Link>
                <h1 className='text-2xl font-bold'>Create Course</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Fill out the form below to create a course.</CardDescription>
                </CardHeader>
                <CardContent>
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
                                        Creating...
                                        <Loader2 className='ml-1 h-4 w-4 animate-spin'/>
                                    </>
                                ): (
                                    <>
                                        Create Course 
                                        <PlusIcon className='ml-1' size={16}/>
                                    </>
                                    )
                                }
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}

export default CreateCoursePage