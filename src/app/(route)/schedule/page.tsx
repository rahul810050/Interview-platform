"use client";

import InterviewSchduleUI from './InterviewSchduleUI';
import LoaderUI from '@/components/LoaderUI';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import React from 'react'

function SchedulePage() {
	const router = useRouter();
	const {isInterviewer, isLoading } = useUserRole();

	if(isLoading) return <LoaderUI/>
	if(!isInterviewer) return router.push("/");
	return <InterviewSchduleUI/>
}

export default SchedulePage