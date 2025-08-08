"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import { description } from "@/components/sidebar/chart-area-interactive";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { lessonSchema, lessonSchemaType } from "@/lib/zodSchemas";
import { title } from "process";

export async function updateLesson(values:lessonSchemaType, lessonId:string):Promise<APIResponse>{
    await requireAdmin();
    try{
        const result=lessonSchema.safeParse(values)
        if(!result.success){
            return {
                status:"error", 
                message:"Invalid Form Data"
            };
        }

        await prisma.lesson.update({
            where:{
                id:lessonId
            }, 
            data:{
                title:result.data.name,
                description:result.data.description,
                videoKey:result.data.videoKey,
                thumbnailKey:result.data.thumbnailKey
            }
        })

        return {
            status:"success",
            message:"Successfully updated lesson"
        }

    }catch{
        return {
            status:"error",
            message:"Something went wrong"
        }
    }
}