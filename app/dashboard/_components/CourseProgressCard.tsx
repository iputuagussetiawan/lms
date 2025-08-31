"use client";
import { EnrolledCoursesType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { useConstructsUrl } from "@/hooks/use-constructs-url";
import Image from "next/image";
import Link from "next/link";

interface CourseProgressCardProps{
    data: EnrolledCoursesType
}
export function CourseProgressCard({data}: CourseProgressCardProps){
    const thumbnailUrl=useConstructsUrl(data.course.fileKey);
    // const {totalLessons, completedLessons, progressPercentage}=useCourseProgress({courseData: data.course});
    return (
        <Card className="group relative py-0 gap-0">
            <Badge className="absolute top-2 right-2 z-10">{data.course.level}</Badge>
            <Image 
                src={thumbnailUrl}
                alt={data.course.title}
                width={600}
                height={400}
                className="aspect-video w-full h-full object-cover rounded-t-xl"
            />
            <CardContent className="p-4">
                <Link href={`/courses/${data.course.slug}`}>
                    <h3 className="font-medium text-lg line-clamp-2 group-hover:text-primary transition-colors">{data.course.title}</h3>
                </Link>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-tight">{data.course.smallDescription}</p>
                {/* <div className="space-y-4 mt-5">
                    <div className="flex items-center justify-between mb-1 text-sm">
                        <p>Progress:</p>
                        <p className="font-medium">{progressPercentage}%</p>
                    </div>
                    <Progress className="h-1.5" value={progressPercentage} />
                    <p className="text-xs text-muted-foreground mt-1">{completedLessons}/{totalLessons} Lessons</p>
                </div> */}
                <Link href={`/dashboard/${data.course.slug}`} className={buttonVariants({ size: "sm", className: "mt-4 w-full" })}>View Course</Link>
            </CardContent>
        </Card>
    )
}

export function PublicCourseCardSkeleton() {
    return (
        <Card className='group relative py-0 gap-0'>
            <div className='absolute top-2 right-2 z-10 flex items-center gap-2'>
                <Skeleton className='h-6 w-16 rounded-full'/>
                <Skeleton className='size-8 rounded-md'/>
            </div>
            <div className='relative w-full h-fit'>
                <Skeleton className='w-full h-[250px] object-cover rounded-t-lg aspect-video '/>
            </div>
            <CardContent className='p-4'>
                <Skeleton className='h-6 w-full'/>
                <Skeleton className='h-6 w-full mt-2'/>
                <Skeleton className='h-4 w-1/2 mt-2'/>
                <div className='mt-4 flex items-center gap-x-5'>
                    <div className='flex items-center gap-x-2'>
                        <Skeleton className='size-6 p-1 rounded-md'/>
                        <Skeleton className='h-4 w-16'/>
                    </div>
                    <div className='flex items-center gap-x-2'>
                        <Skeleton className='size-6 p-1 rounded-md'/>
                        <Skeleton className='h-4 w-16'/>
                    </div>
                </div>
                <Skeleton className='h-8 w-full mt-4'/>
            </CardContent>
        </Card>
    )
}