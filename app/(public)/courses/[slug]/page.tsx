import { getCourseDetail } from "@/app/data/course/get-course";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useConstructsUrl } from "@/hooks/use-constructs-url";
import { IconCategory, IconChartBar, IconClock } from "@tabler/icons-react";
import Image from "next/image";

type Params=Promise<{slug:string}>

export default async function CourseDetailPage({params}:{params:Params}){
    const {slug} =await params;
    const course =await getCourseDetail(slug);
    const thumbnailUrl=useConstructsUrl(course.fileKey);
    return (
        <div className="grid grid-col-1 gap-8 lg:grid-cols-3 mt-5">
            <div className="order-1 lg:col-span-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                    <Image 
                        src={thumbnailUrl} 
                        alt="course image" 
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">
                            {course.title}
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">{course.smallDescription}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Badge className="flex items-center gap-1 px-3 py-1">
                            <IconChartBar className="size-4 mr-1"/>
                            <span>
                                {course.level}
                            </span>
                        </Badge>
                        <Badge className="flex items-center gap-1 px-3 py-1">
                            <IconCategory className="size-4 mr-1"/>
                            <span>
                                {course.category}
                            </span>
                        </Badge>
                        <Badge className="flex items-center gap-1 px-3 py-1">
                            <IconClock className="size-4 mr-1"/>
                            <span>
                                {course.duration} hour
                            </span>
                        </Badge>
                    </div>
                    <Separator className="my-4"/>
                    <div className="space-y-6"> 
                        <h2 className="text-3xl font-semibold tracking-tight">Course Description</h2>
                        <RenderDescription json={JSON.parse(course.description)}/>
                    </div>
                </div>
                <div className="mt-12 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-semibold tracking-tight">
                            Course Content
                        </h2>
                        <div>
                            {course.chapter.length} Chapters
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}