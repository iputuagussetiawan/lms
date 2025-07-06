"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { courseSchema, courseSchemaType } from "@/lib/zodSchemas";
import { headers } from "next/headers";

export async function CreateCourse(values:courseSchemaType):Promise<APIResponse>{
    try{
        const session =await auth.api.getSession({
            headers:await headers(),
        });
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