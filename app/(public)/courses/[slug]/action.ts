"use server";

import { requireUser } from "@/app/data/user/require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { APIResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const aj=arcjet.withRule(
    fixedWindow({
        mode:"LIVE",
        window:"1m",
        max:5,
    })
)


export async function  enrollInCourseAction(courseId:string): Promise<APIResponse | never> {
    const user=await requireUser();

    let checkoutUrl:string
    try {
        const req=await request()
        const decision=await aj.protect(req,{
            fingerprint:user.id
        })

        if(decision.isDenied()){
            return{
                status:"error",
                message:"You have been rate limited / blocked. Please try again later."
            }
        }
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            select:{
                id:true,
                title:true,
                price:true,
                slug:true,
                stripePriceId:true
            }
        })

        if(!course){
            return{
                status:"error",
                message:"Course not found"
            }
        }

        let stripeCustomerId:string
        const userWithStripeCustomerId= await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select:{
                stripeCustomerId:true
            }
        });

        if(userWithStripeCustomerId?.stripeCustomerId){
            stripeCustomerId=userWithStripeCustomerId.stripeCustomerId
        }else{
            const customer=await stripe.customers.create({
                email:user.email,
                name:user.name,
                metadata:{
                    userId:user.id
                }
            });

            stripeCustomerId=customer.id;
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    stripeCustomerId: stripeCustomerId
                }
            });
        }

        const result=await prisma.$transaction(async(tx)=>{
            const existingEnrollment=await tx.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: course.id
                    }
                }, 
                select :{
                    status:true,
                    id:true,
                }
            })

            if(existingEnrollment?.status==="ACTIVE"){
                return{
                    status:"success",
                    message:"You are already enrolled in this course"
                }
            }

            let enrollment;
            if(existingEnrollment){
                enrollment= await tx.enrollment.update({
                    where: {
                        id: existingEnrollment.id
                    },  
                    data: {
                        amount: course.price/100,
                        status:"PENDING",
                        updatedAt: new Date()
                    }
                })
            }else{
                enrollment= await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        amount: course.price/100,
                        status:"PENDING"
                    }
                })
            }

            const checkoutSession=await stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                line_items: [
                    {
                        price:course.stripePriceId as string,
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `${process.env.BETTER_AUTH_URL}/payment/success`,
                cancel_url: `${process.env.BETTER_AUTH_URL}/payment/cancel`,
                metadata: {
                    userId: user.id,
                    courseId: course.id,
                    enrollmentId: enrollment.id
                }
            });

            return{
                enrollment:enrollment,
                checkoutUrl:checkoutSession.url
            };
        });

        checkoutUrl=result.checkoutUrl as string
    }catch (error) {
        if(error instanceof Stripe.errors.StripeError){
            return{
                status:"error",
                message:"Stripe Error: "+error.message
            }
        }
        return{
            status:"error",
            message:"Failed to enroll in course"
        }
    }
    redirect(checkoutUrl);
}