'use client'
import { buttonVariants } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import React from 'react'

const UserButton = () => {
    const {data:session, isPending}=authClient.useSession()
    return (
        <>
            {isPending? null : session ? (
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Link className={buttonVariants({ size: "lg" })} href="/courses">Explore Courses</Link>
                    
                </div>
            ):(
                <>
                    <Link href='/login' className={buttonVariants()} >Get Started</Link>
                </>
            )}
            
        </>
    )
}

export default UserButton