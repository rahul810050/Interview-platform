import React from 'react'
import { ModeToggle } from './ToggleMode'
import Link from 'next/link'
import { CodeIcon } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import DashboardBtn from './DashboardBtn'

function Navbar() {
	return (
		<nav className='border-b'>
			<div className='flex h-16 items-center px-4 container mx-auto justify-between max-w-7xl'>
				{/* left logo */ }
				<Link href={'/'} className='flex items-center gap-2 font-semibold text-2xl font-mono hover:opacity-80 transition-opacity'>
					<CodeIcon className='size-8 text-teal-500'/>
					<span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
            InterViewer
          </span>
				</Link>

				<SignedOut>
          <div className="flex items-center space-x-4">
					<SignInButton>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition">Sign In</button>
            </SignInButton>
            <SignUpButton>
              <button className="px-4 py-2 bg-gray-200 text-teal-600 rounded-md hover:bg-gray-300 transition">Sign Up</button>
            </SignUpButton>
          </div>
        </SignedOut>

				<SignedIn>
          <div className="flex items-center space-x-4">
            <DashboardBtn />
            <ModeToggle />
            <UserButton />
          </div>
        </SignedIn>
			</div>
		</nav>
	)
}

export default Navbar
