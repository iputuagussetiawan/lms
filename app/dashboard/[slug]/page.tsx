import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";
type Params=Promise<{
    slug:string;
}>
export default async function CourseSlugPage({params}:{params:Params}) {
    const {slug}= await params
    const course = await getCourseSidebarData(slug);
    // ✅ safely check if chapters exist
    const firstChapter = course?.course?.chapter?.[0];
    const firstLesson = firstChapter?.lessons?.[0] || null;
    if(firstLesson){
        redirect(`/dashboard/${slug}/${firstLesson.id}`)
    }
    return (
        <div className="flex items-center justify-center h-full text-center">
            <div>
                <h1 className="text-3xl font-bold mb-2">No Lessons Found</h1>
                <p className="text-muted-foreground">Please add some lessons to this course</p>
            </div>
        </div>
    )
}