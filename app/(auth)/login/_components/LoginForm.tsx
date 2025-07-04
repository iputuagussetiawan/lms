"use client"

import React, { useState, useTransition } from 'react'
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GithubIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const LoginForm = () => {

    const router = useRouter()
    const [githubPending, startGithubTransition] = useTransition(); 
    const [emailPending, startEmailTransition] = useTransition(); 
    const [email, setEmail]=useState("");
    async function signInWithGithub() {
        startGithubTransition(async () => {
            await authClient.signIn.social({
            provider: "github",
            callbackURL: "/",
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Logged in successfully")
                },
                onError: () => {
                    toast.error("internal server error")
                }
            }
        })
        })
    }

    function signInWithEmail(){
        startEmailTransition(async () => {
            await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type:'sign-in',
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("OTP sent successfully")
                        router.push(`/verify-request?email=${email}`)
                    },
                    onError: () => {
                        toast.error("Error Sending OTP Email")
                    }
                }
            })
        })
    }
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Welcome back!</CardTitle>
                    <CardDescription>Login with your Github Email Account</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Button 
                        disabled={githubPending}
                        onClick={signInWithGithub}
                        className="w-full"
                        variant={"outline"}
                    >
                        {githubPending?(
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>Loading...</span>
                            </>
                        ):(
                            <>
                                <GithubIcon className="size-4" />
                                <span>Continue with Github</span>
                            </>
                        )}
                    </Button>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-card px-2 text-muted-foreground">Or continue with email</span>
                    </div>
    
                    <div className="grid gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email" 
                                type="email" 
                                placeholder="yourmail@example.com" 
                            />
                        </div>
                        <Button 
                            className="w-full"
                            disabled={emailPending}
                            onClick={signInWithEmail}
                        >
                            {emailPending?(
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>Loading...</span>
                            </>
                        ):(
                            <>
                                <span>Continue with email</span>
                            </>
                        )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginForm