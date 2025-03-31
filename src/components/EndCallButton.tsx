import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { api } from '../../convex/_generated/api';
import { Button } from './ui/button';
import toast from 'react-hot-toast';

function EndCallButton() {
	const call = useCall();
	const router = useRouter();
	const { useLocalParticipant} = useCallStateHooks();
	const localParticipants = useLocalParticipant();
	const updateInterviewStatus = useMutation(api.interviews.updateIterviewStatus);

	const interview = useQuery(api.interviews.getInterviewByStreamCallId, {
		streamCallId: call?.id || ""
	});

	if(!call || !interview) return null;

	const isMeetingOwner = localParticipants?.userId === call.state.createdBy?.id;

	if(!isMeetingOwner) return null;

	const endCall = async ()=> {
		try{
			await call.endCall();
			await updateInterviewStatus({
				id: interview[0]?._id,
				status: "completed"
			})
			router.push("/");
			toast.success("Meeting ended for everyone")
		} catch(e){
			console.log(e);
			toast.error("Failed to end the Meeting")
		}
	}

	return (
		<Button variant={"destructive"} onClick={endCall}>End Meeting</Button>
	)
}

export default EndCallButton