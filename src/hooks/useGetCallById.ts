import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react"



const useGetCallById = (id: string | string[])=> {
	const [call, setCall] = useState<Call>();
	const [isCallLoading, setIsCallLoading] = useState(true);

	const client = useStreamVideoClient();

	useEffect(()=> {
		if(!client) return;

		const getCall = async()=> {
			try{
				const {calls} = await client.queryCalls({filter_conditions: {id}});
				if(calls.length > 0) setCall(calls[0]);
			} catch(e){
				console.error("error aa gaya bhai",e);
				setCall(undefined);
			} finally{
				setIsCallLoading(false);
			}
		}

		getCall()
	}, [id, client])

	return { call, isCallLoading };
}

export default useGetCallById;