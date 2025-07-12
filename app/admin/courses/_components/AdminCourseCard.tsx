import { AdminCourseType } from '@/app/data/admin/admin-get-courses'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useConstructsUrl } from '@/hooks/use-constructs-url'
import { ArrowRight, ArrowRightIcon, Eye, MoreVerticalIcon, PencilIcon, School, TimerIcon, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { use } from 'react'


interface  AdminCourseCardProps {
    data: AdminCourseType
}
const AdminCourseCard = ({data}: AdminCourseCardProps) => {
    const thumbnailUrl=useConstructsUrl(data.fileKey);
    return (
        <Card className='group relative py-0 gap-0'>
            <div className='absolute top-2 right-2 z-10'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='secondary' size='icon'>
                            <MoreVerticalIcon className='size-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-48'>
                        <DropdownMenuItem asChild>
                            <Link 
                                href={`/admin/courses/${data.id}/edit`} 
                            >
                                <PencilIcon className='size-4 mr-2' /> Edit Course
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link 
                                href={`/courses/${data.slug}`} 
                            >
                                <Eye className='size-4 mr-2' /> Preview
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link 
                                href={`admin/courses/${data.id}/delete`} 
                            >
                                <Trash2 className='size-4 mr-2 text-destructive' /> Delete Course
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Image 
                src={thumbnailUrl} 
                alt={data.title} 
                width={600} 
                height={400}
                className='w-full h-full rounded-t-lg aspect-video object-cover' 
            />
            <CardContent className='p-4'>
                <Link href={`/admin/courses/${data.id}`} className='font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors'>{data.title}</Link>
                <p className='text-muted-foreground line-clamp-2 text-sm leading-tight mt-2'>{data.smallDescription}</p>
                <div className='mt-4 flex items-center gap-x-5'>
                    <div className='flex items-center gap-x-2'>
                        <TimerIcon className='size-6 p-1 rounded-md text-primary bg-primary/10' />
                        <p className='text-sm text-muted-foreground'>{data.duration}h</p>
                    </div>
                    <div className='flex items-center gap-x-2'>
                        <School className='size-6 p-1 rounded-md text-primary bg-primary/10' />
                        <p className='text-sm text-muted-foreground'>{data.level}</p>
                    </div>
                </div>
                <Link 
                    className={buttonVariants({
                        className:"w-full mt-4"
                    })}
                    href={`/admin/courses/${data.id}/edit`} 
                >
                    Edit Course <ArrowRightIcon className='size-4' />
                </Link>
            </CardContent>
        </Card>
    )
}

export default AdminCourseCard
