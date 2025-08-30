"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function markLessonCompleted(lessonId: string, slug: string): Promise<APIResponse> {
    const session =await requireUser();

    try{
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.id,
                    lessonId: lessonId
                },
            },

            update: {
                completed: true
            },

            create: {
                lessonId: lessonId,
                userId: session.id,
                completed: true
            },
        })

        revalidatePath(`/dashboard/${slug}`)

        return {
            status:"success",
            message:"Progress Updated."
        }
    }catch{
        return{
            status:"error",
            message:"Failed to mark lesson as completed."
        }
    }
}