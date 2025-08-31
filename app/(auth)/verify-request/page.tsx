"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { authClient } from '@/lib/auth-client'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useState, useTransition } from 'react'
import { toast } from 'sonner'

export default function VerifyRequest() {
    return (
        <Suspense>
            <VerifyRequestPage />
        </Suspense>
    )
}

function VerifyRequestPage() {
    const router=useRouter()
    const [otp, setOtp]=useState('');
    const [emailPending, startEmailTransition] = useTransition(); 
    const params=useSearchParams()
    const email = params.get('email')
    const isOtpCompleted=otp.length===6

    function verifyOtp(){
        startEmailTransition(async () => {
            await authClient.signIn.emailOtp({
                email:email as string,
                otp:otp,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged in successfully");
                        router.push("/")
                    },
                    onError: () => {
                        toast.error("Error verifying email/OTP")
                    }
                }
            })
        })
    }
    return (
        <Card className='w-full mx-auto'>
            <CardHeader className='text-center'>
                <CardTitle className='text-xl'>Please Check Your Email</CardTitle>
                <CardDescription>
                    We have sent a verification link to your email address. Please check your inbox and click the link to verify your account.
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='flex flex-col items-center space-y-2'>
                    <InputOTP value={otp} onChange={(value)=>setOtp(value)} maxLength={6} className='gap-2'>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <div className='text-sm text-muted-foreground'>
                        Enter the 6-digit code sent to your email address
                    </div>
                </div>
                <Button 
                    className='w-full'
                    onClick={verifyOtp}
                    disabled={emailPending || !isOtpCompleted}
                >
                    {emailPending?(
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Loading...</span>
                        </>
                    ):(
                        <>
                            <span>Verify Account</span>
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}

