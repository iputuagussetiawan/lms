
import { adminGetCourses } from '@/app/data/admin/admin-get-courses';
import { buttonVariants } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import AdminCourseCard from './_components/AdminCourseCard';

export default async function CoursesPage(){
    const data=await adminGetCourses();
    return (
        <> 
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>
                    Your Courses
                </h1>
                <Link href='/admin/courses/create' className={buttonVariants({ size: 'sm' })}><PlusIcon className='h-4 w-4'/>Create Course</Link>
            </div>
            <div>
                <p>Here you can create and manage your courses</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
                {data.map((course)=>(
                    <AdminCourseCard key={course.id} data={course} />
                ))}
            </div>
        </>
    )
}