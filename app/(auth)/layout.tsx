import React from 'react'

const AuthLayout = ({children}:{children:React.ReactNode}) => {
    return (
        <div className='relative flex flex-col min-h-svh w-full items-center justify-center'>
            <div className='flex w-full max-w-sm flex-col gap-6'>
                <h1>Hey this is the auth layout nav</h1>
                {children}
            </div>
        </div>
    )
}

export default AuthLayout