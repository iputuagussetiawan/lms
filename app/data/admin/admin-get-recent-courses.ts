import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetRecentCourses() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await requireAdmin();
    const data = await prisma.course.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
        select : {
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
    return data;
}