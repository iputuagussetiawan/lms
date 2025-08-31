import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"

export async function getCourseDetail(slug:string){
    const course=await prisma.course.findUnique({
        where: {
            slug:slug
        },
        select: {
            id: true,
            title: true,
            description: true,
            smallDescription: true,
            duration: true,
            level: true,
            status: true,
            price:true,
            fileKey: true,
            slug:true,
            category: true, 
            chapter: {
                select: {
                    id: true,
                    title: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
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

    if(!course) {
        return notFound();
    }
    return course
}