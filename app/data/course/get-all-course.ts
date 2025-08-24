import { prisma } from "@/lib/db"

export async function getAllCourse(){
    const data =await prisma.course.findMany({
        where: {
            status:"PUBLISHED"
        },
        orderBy: {
            createdAt: "desc",
        },
        select:{
            id: true,
            title: true,
            smallDescription: true,
            duration: true,
            level: true,
            status: true,
            price:true,
            fileKey: true,
            slug:true,
            category: true
        }
    });

    return data
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourse>>[0];