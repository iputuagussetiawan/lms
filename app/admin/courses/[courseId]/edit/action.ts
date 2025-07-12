"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { courseSchema, courseSchemaType } from "@/lib/zodSchemas";


export async function editCourse(data:courseSchemaType, courseId:string):Promise<APIResponse>{
    const user =await requireAdmin()
    try{
        const result=courseSchema.safeParse(data)

        if(!result.success){
            return {
                status:"error", 
                message:"Invalid Form Data"
            };
        }

        await prisma.course.update({
            where: {
                id: courseId,
                userId:user.user.id
            },
            data:{
                ...result.data,
            }
        });

        return {
            status:"success", 
            message:"Course updated successfully"
        };
        
    }catch{
        return {
            status:"error", 
            message:"Failed to update course"
        };
    }
}