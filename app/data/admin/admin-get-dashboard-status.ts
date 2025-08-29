import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetDashboardStatus() {
    await requireAdmin();
    const [totalSignup, totalCustomers, totalCourse, totalLesson] =await Promise.all([
        //total user
        prisma.user.count(),

        //total customers
        prisma.user.count({
            where:{
                enrollment:{
                    some: {}
                }
            }
        }),

        //total course 
        prisma.course.count(),

        //total lesson
        prisma.lesson.count(),
    ]) 

    return{
        totalSignup,
        totalCustomers,
        totalCourse,
        totalLesson
    }
}