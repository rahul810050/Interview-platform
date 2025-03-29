"use client"
import React from "react";
import { Button } from "./ui/button";
import { SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useUserRole } from "@/hooks/useUserRole";

function DashboardBtn() {
	const {isCandidate, isLoading} = useUserRole(); 

	if(isCandidate || isLoading) return null;
  return (
    <Link href="/dashboard" passHref>
      <Button className="gap-2 font-medium bg-teal-500 hover:bg-teal-600 dark:hover:bg-teal-400 transition duration-300 rounded-md shadow-md px-4 py-2 flex items-center">
        <SparklesIcon className="size-4" />
        Dashboard
      </Button>
    </Link>
  );
}

export default DashboardBtn;
