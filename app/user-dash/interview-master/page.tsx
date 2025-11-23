// app/user-dash/interview-master/page.tsx
"use client";
import { UserNavbar } from "@/components/(my-dashboard)/user-navbar";
import { InterviewMaster } from "@/components/(my-dashboard)/interview-master";

export default function InterviewMasterPage(){
  return(
    <>
    <UserNavbar />
    <InterviewMaster />
    </>
  )
}