import { StreamClientProvider } from '@/components/providers/StreamClientProvider'
import React from 'react'

function Layout({children}: {children: React.ReactNode}) {
	return (
		<StreamClientProvider>{children}</StreamClientProvider>
	)
}

export default Layout