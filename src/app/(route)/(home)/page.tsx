"use client"

import ActionCard from "@/components/ActionCard";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MeetingModel from "@/components/MeetingModel";

export default function Home() {
  const router = useRouter();
  const {isCandidate, isInterviewer, isLoading} = useUserRole();
  const interviews = useQuery(api.interviews.getMyInterview);
  const [showModel, setShowModel] = useState(false);
  const [modelType, setModelType] = useState<"start" | "join">()

  const handleActionCard = (title: string)=> {
    switch(title){
      case "New Call": 
        setModelType("start")
        setShowModel(true)
        break;
      case "Join Interview":
        setModelType("join")
        setShowModel(true)
        break;
      default:
        router.push(`/${title.toLowerCase()}`)
    }
  }
  return (
    <div className="container max-w-5xl mx-auto p-6">
      {/* WELCOME SECTION */}
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2 ">
          {isInterviewer
            ? "Manage your interviews and review candidates effectively"
            : "Access your upcoming interviews and preparations"}
        </p>
      </div>

      {isInterviewer ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUICK_ACTIONS.map((action)=> (
              <ActionCard
              key={action.title}
              action={action}
              onClick={()=> handleActionCard(action.title)}
              />
            ))}
          </div>
          <MeetingModel
          isOpen={showModel}
          onClose={()=> setShowModel(false)}
          title={modelType === "join"? "Join Meeting": "Start Meeting"}
          isJoinMeeting={modelType==="join"}
          />
        </>
      ): (
        <>
          <div>candidate should see something</div>
        </>
      )}
      
    </div>
  );
}
