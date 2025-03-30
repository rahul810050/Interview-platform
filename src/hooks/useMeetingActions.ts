import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast'



const useMeetingActions = () => {
	const router = useRouter();
	const client = useStreamVideoClient();

	// let callId = "";

	const createInstantMeeting = async ()=> {
		if(!client) return ;

		try{
			const id = crypto.randomUUID();
			const call = client.call("default", id);

			await call.getOrCreate({
				data: {
					starts_at: new Date().toISOString(),
					custom: {
						description: "Instant Meeting"
					},
				},
			})

			// callId = call.id.toString();
			router.push(`/meeting/${call.id}`)
			toast.success("Meeting created")
		} catch(e){
			console.log(e)
			toast.error("failed to create meeting")
		}
	}

	const joinMeeting = (callId: string)=> {
		if(!client) return toast.error("Failed to join the meeting. Please try again");
		router.push(`/meeting/${callId}`)
	}

	return { createInstantMeeting, joinMeeting };
}

export default useMeetingActions;