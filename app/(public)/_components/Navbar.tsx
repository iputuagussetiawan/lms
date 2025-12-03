'use client'
import { buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/themeToggle'
import { authClient } from '@/lib/auth-client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { UserDropdown } from './user-dropdown'


// FIX 1: Define the correct structure for navigationItems
const navigationItems = [
    { name: 'Courses', href: '/courses' },
    // Add more items here as needed
] 

// FIX 2: Ensure the component is correctly typed if using TypeScript
const Navbar = () => {

    // Destructuring with a default value for session might be safer, 
    // though the conditional rendering handles the session being null.
    const { data: session, isPending } = authClient.useSession()
    
    return (
        <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60'>
            <div className='container mx-auto flex h-16 items-center px-4 md:px-6 lg:px-8'>
                <Link href='/' className='flex items-center space-x-2 mr-4'>
                    {/* IMPROVEMENT: Add a loading state or adjust sizing */}
                    <Image className='size-9' src='/logo.svg' alt='logo' width={36} height={36} /> 
                    <span className='font-bold'>LMS.</span>
                </Link>
                {/* desktop navigation */}
                <nav className='hidden md:flex md:flex-1 md:items-center md:justify-between'>  
                    <div className='flex items-center space-x-2'>
                        {
                            // FIX 3: Optional Chaining on navigationItems in case it is undefined/null
                            navigationItems?.length > 0 &&
                            navigationItems.map((item, index) => (
                                <Link
                                    // IMPROVEMENT: Use a unique ID if possible, otherwise index is fine
                                    key={item.href || index} 
                                    href={item.href}
                                    className='text-sm font-medium transition-colors hover:text-primary'
                                >
                                    {item.name}
                                </Link>
                            ))
                        }
                    </div>

                    <div className='flex items-center space-x-4'>
                        <ThemeToggle/>
                        {isPending ? (
                            // IMPROVEMENT: Display a subtle loading indicator while pending
                            <div className='h-8 w-20 animate-pulse rounded-md bg-muted' />
                        ) : session ? (
                            <UserDropdown 
                                name={ 
                                    // IMPROVEMENT: Use || to provide a clean fallback
                                    session.user.name || session.user.email.split("@")[0]
                                }
                                email={session.user.email} 
                                // FIX 4: Ensure image is passed as a string (which the || "" already does)
                                image={session.user.image || ""} 
                            />
                        ):(
                            <>
                                <Link href='/login' className={buttonVariants({ variant: "secondary" })} >Login</Link>
                                <Link href='/register' className={buttonVariants()} >Get Started</Link> 
                                {/* IMPROVEMENT: Changed second link to /register */}
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}
export default Navbar