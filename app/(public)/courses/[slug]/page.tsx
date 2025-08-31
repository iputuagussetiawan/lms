import { getCourseDetail } from "@/app/data/course/get-course";
import { checkIfCourseBought } from "@/app/data/user/user-is-enrolled";
import CourseInfo from "./_components/CourseInfo";

type Params=Promise<{slug:string}>

export default async function CourseDetailPage({params}:{params:Params}){
    const {slug} =await params;
    const course =await getCourseDetail(slug);
    const isEnrolled=await checkIfCourseBought(course.id);
    return (
        <>
            <CourseInfo course={course} isEnrolled={isEnrolled}/>
        </>
    )
}