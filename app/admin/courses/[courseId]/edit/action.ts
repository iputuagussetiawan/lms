"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { courseSchema, courseSchemaType } from "@/lib/zodSchemas";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet"
import { request } from "@arcjet/next";


const aj=arcjet.withRule(
    detectBot({
        mode:"LIVE",
        allow:[],
    })
).withRule(
    fixedWindow({
        mode:"LIVE",
        window:"1m",
        max:5,
    })
)


export async function editCourse(data:courseSchemaType, courseId:string):Promise<APIResponse>{
    const user =await requireAdmin()
 
    
    try{
        const req=await request()
        const decision=await aj.protect(req,{
            fingerprint:user?.user.id as string,
        })

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return {
                    status:"error",
                    message:"Rate limit exceeded",
                }
            }else{
                return {
                    status:"error",
                    message:"You are not authorized to perform this action",
                }
            }
        }



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