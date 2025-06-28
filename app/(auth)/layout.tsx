import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AuthLayout = ({children}:{children:React.ReactNode}) => {
    return (
        <div className='relative flex flex-col min-h-svh w-full items-center justify-center'>
            <Link 
                href='/'
                className={buttonVariants({
                    variant:'outline',
                    className:'absolute left-4 top-4'
                })}
            >
                <ArrowLeft className='size-4'/>
                <span>Back</span>
            </Link>
            <div className='flex w-full max-w-sm flex-col gap-6'>
                <Link href='/' className='flex items-center justify-center gap-2 self-center font-medium'>
                    <Image className='w-10' src='/logo.svg' alt='logo' width={100} height={100}/>
                    Learning Management System.
                </Link>
                {children}
                <div className='text-balance text-center text-xs text-muted-foreground'>
                    By clicking continue, you agree to our <span className='hover:text-primary hover:underline'>Terms of Service</span> and <span className='hover:text-primary hover:underline'>Privacy Policy</span>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout