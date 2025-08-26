import { PublicCourseType } from "@/app/data/course/get-all-course";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructsUrl } from "@/hooks/use-constructs-url";
import { SchoolIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


interface PublicCourseCardProps{
    data: PublicCourseType
}
export function PublicCourseCard({data}: PublicCourseCardProps){
    const thumbnailUrl=useConstructsUrl(data.fileKey);
    return (
        <Card className="group relative py-0 gap-0">
            <Badge className="absolute top-2 right-2 z-10">{data.level}</Badge>
            <Image 
                src={thumbnailUrl}
                alt={data.title}
                width={600}
                height={400}
                className="aspect-video w-full h-full object-cover rounded-t-xl"
            />
            <CardContent className="p-4">
                <Link href={`/courses/${data.slug}`}>
                    <h3 className="font-medium text-lg line-clamp-2 group-hover:text-primary transition-colors">{data.title}</h3>
                </Link>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-tight">{data.smallDescription}</p>
                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10"/> <p className="text-sm text-muted-foreground">{data.duration}h</p> 
                    </div>
                    <div className="flex items-center gap-x-2">
                        <SchoolIcon className="size-6 p-1 rounded-md text-primary bg-primary/10"/> <p className="text-sm text-muted-foreground">{data.category} </p> 
                    </div>
                </div>
                <Link href={`/courses/${data.slug}`} className={buttonVariants({ size: "sm", className: "mt-4 w-full" })}>View Course</Link>
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