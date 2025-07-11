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

export async function CreateCourse(values:courseSchemaType):Promise<APIResponse>{
    const session=await requireAdmin()
    try{
        const req=await request()
        const decision=await aj.protect(req,{
            fingerprint:session?.user.id as string,
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
        const validation =courseSchema.safeParse(values);

        if(!validation.success){
            return {
                status:"error",
                message:"Invalid Form Data",
            };
        }

        await prisma.course.create({
            data:{
                ...validation.data,
                userId:session?.user.id as string
            }
        });

        return {
            status:"success",
            message:"Course Created Successfully",
        }

    }catch{
        return{
            status:"error",
            message:"Failed to create course",
        }
    }
}