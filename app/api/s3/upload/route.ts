import { PutObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"
import { z } from "zod"
import {v4 as uuidv4} from 'uuid'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import { S3 } from "@/lib/S3Client"

export const fileUploadSchema=z.object({
    fileName:z.string().min(1, {message: "File name is required"}),
    contentType:z.string().min(1, {message: "Content type is required"}),
    size:z.number().min(1, {message: "Size is required"}),
    isImage:z.boolean(),
})

export async function POST(request: Request) {
    try{
        const body=await request.json()
        const validation=fileUploadSchema.safeParse(body)
        if(!validation.success){
            return NextResponse.json(
                {error:'Invalid request body'}, 
                {status:400}
            );
        }
        const {fileName, contentType, size}=validation.data
        const uniqueFileName=`${uuidv4()}-${fileName}`
        const command=new PutObjectCommand({
            Bucket:process.env.AWS_S3_BUCKET_NAME,
            ContentType:contentType,
            ContentLength:size,
            Key:uniqueFileName,
        })

        const presignedUrl=await getSignedUrl(S3, command, {
            expiresIn:360, //url expired in 6 minutes
        })

        const response={
            presignedUrl,
            key:uniqueFileName
        }
        return NextResponse.json(response)

    }catch{
        return NextResponse.json(
            {error:'Failed to generate presigned url'}, 
            {status:500}
        );  
    }
}