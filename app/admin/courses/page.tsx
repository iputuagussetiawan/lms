
import { buttonVariants } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CoursesPage = () => {
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
        </>
    )
}

export default CoursesPage