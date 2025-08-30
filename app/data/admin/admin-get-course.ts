import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function adminGetCourse(id:string){
    // await new Promise((resolve) => setTimeout(resolve, 100000));
    await requireAdmin();
    const data = await prisma.course.findUnique({
        where:{
            id:id,
        },
        select : {
            id: true,
            title: true,
            description: true,
            smallDescription: true,
            fileKey: true,
            price:true,
            duration: true,
            level: true,
            status: true,
            slug:true,
            category: true,
            chapter: {
                orderBy: {
                    position: "asc", // ✅ order chapters by position
                },
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            thumbnailKey: true,
                            position: true,
                            videoKey: true,
                        }
                    }
                }
            }
        }
    });

    if(!data){
        return notFound();
    }

    return data;
}

export type AdminCourseSingularType = Awaited<ReturnType<typeof adminGetCourse>>
