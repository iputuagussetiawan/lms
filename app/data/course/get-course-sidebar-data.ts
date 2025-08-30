import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getCourseSidebarData(slug:string) {
    const session=await requireUser()

    const course = await prisma.course.findUnique({
        where:{
            slug:slug
        },
        select:{
            id:true,
            title:true,
            smallDescription:true,
            duration:true,
            level:true,
            status:true,
            price:true,
            fileKey:true,
            slug:true,
            category:true,
            chapter: {
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                            position: true,
                            description: true,
                            lessonProgress:{
                                where: {
                                    userId: session.id
                                },
                                select: {
                                    id: true,
                                    lessonId: true,
                                    completed: true,
                                }
                            }
                        },
                        orderBy: {
                            position: "asc", // ✅ order chapters by position
                        },
                    }
                },
                orderBy: {
                    position: "asc", // ✅ order chapters by position
                },
            }
        }
    })

    if(!course){
        return notFound();
    }

    const enrollment=await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.id,
                courseId: course.id
            }
        },
        select: {
            status: true
        }
    })

    if(!enrollment || enrollment.status!=="ACTIVE"){
        return notFound();
    }


    return {
        course
    }
}

export type CourseSidebarDataType=Awaited<ReturnType<typeof getCourseSidebarData>>