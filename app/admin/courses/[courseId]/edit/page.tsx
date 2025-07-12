import { adminGetCourse } from '@/app/data/admin/admin-get-course'
import React from 'react'

type Params = Promise<{courseId:string}>
const EditCoursePage = async ({params}:{params:Params}) => {
    const {courseId}=await params;
    const data=await adminGetCourse(courseId);
    return (
        <div>
            <h1>Edit Course : <span>{data.title}</span> </h1>
        </div>
    )
}

export default EditCoursePage