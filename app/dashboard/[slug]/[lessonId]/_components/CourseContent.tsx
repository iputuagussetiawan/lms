import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { useConstructsUrl } from "@/hooks/use-constructs-url";
import { BookIcon, CheckCircleIcon } from "lucide-react";

interface CourseContentProps {
    data:LessonContentType
}
export function CourseContent({data}:CourseContentProps) {
    function VideoPlayer({thumbnailKey, videoKey}:{ thumbnailKey: string, videoKey: string }) {
        const videoUrl=useConstructsUrl(videoKey)
        const thumbnailUrl=useConstructsUrl(thumbnailKey)

        if(!videoKey){
            return (
                <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
                    <BookIcon className="size-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">This lesson does not have a video yet</p>
                </div>
            )
        }

        return (
            <div className="aspect-video relative bg-muted rounded-lg flex flex-col items-center justify-center overflow-hidden">
                <video 
                    controls 
                    autoPlay
                    className="w-full h-full object-cover"
                    poster={thumbnailUrl}
                >
                    <source src={videoUrl} type="video/mp4" />
                    <source src={videoUrl} type="video/webm" />
                    <source src={videoUrl} type="video/ogg" />
                    Your browser does not support the video tag.
                </video>
            </div>
        )
    }
    return (
        <div className="flex flex-col h-full bg-background pl-6">
            <VideoPlayer 
                thumbnailKey={data.thumbnailKey ?? ""} 
                videoKey={data.videoKey ?? ""} 
            />
            <div className="py-4 border-b">
                <Button variant={'outline'}>
                    <CheckCircleIcon className="size-4 mr-2 text-green-500" />
                    Mark As Complete
                </Button>
            </div>

            <div className="space-y-4 pt-4">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    {data.title}
                </h1>
                {data.description &&(
                    <RenderDescription json={JSON.parse(data.description)} />
                )}
            </div>
        </div>
    );
}