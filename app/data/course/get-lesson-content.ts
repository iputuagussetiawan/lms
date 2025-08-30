import { prisma } from "@/lib/db";
import "server-only"
import { requireUser } from "../user/require-user";
import { notFound } from "next/navigation";

export async function getLessonContent(lessonId:string) {
    const session =await requireUser();

    const lesson=await prisma.lesson.findUnique({
        where:{
            id:lessonId
        },
        select: {
            id: true,
            title: true,
            videoKey: true,
            thumbnailKey: true,
            description: true,
            position: true,
            chapter: {
                select: {
                    courseId: true
                }
            }
        }
    })

    if(!lesson) {
        return notFound()
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.id,
                courseId: lesson.chapter.courseId
            }
        },
        select: {
            status: true
        }
    })

    if(enrollment?.status !== "ACTIVE") {
        return notFound()
    }

    return lesson
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>