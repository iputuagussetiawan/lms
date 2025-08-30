import { ChartAreaInteractive } from '@/components/sidebar/chart-area-interactive'
import { SectionCards } from '@/components/sidebar/section-cards'
import React, { Suspense } from 'react'
import { adminGetEnrollmentStats } from '../data/admin/admin-get-enrollment-stats'
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { adminGetRecentCourses } from '../data/admin/admin-get-recent-courses';
import { EmptyState } from '@/components/general/EmptyState';
import AdminCourseCard, { AdminCourseCardSkelton } from './courses/_components/AdminCourseCard';



export default async function AdminIndexPage(){
  const enrollmentData = await adminGetEnrollmentStats();
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive data={enrollmentData} />

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Recent Courses</h2>
          <Link href='/admin/courses' className={buttonVariants({ size: 'sm', variant: 'outline' })}>View All Courses</Link>
        </div>
        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  )
}

async function RenderRecentCourses(){
  const data = await adminGetRecentCourses();

  if(
    data.length === 0
  ){
    return (
      <EmptyState 
        title='No Courses Found' 
        description='Create a course to get started' 
        buttonText='Create Course' 
        href='/admin/courses/create'
      />
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  )
}

function RenderRecentCoursesSkeletonLayout() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
      {Array.from({ length: 3 }).map((_, index) => (
        <AdminCourseCardSkelton key={index} />
      ))}
    </div>
  )
}

