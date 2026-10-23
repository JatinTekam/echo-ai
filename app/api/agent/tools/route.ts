import { AgentConfig, db } from "@/db";
import { getOrCreateAgentSession } from "@/lib/get-agent-composio-agent-session";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){

    const searchParams=req.nextUrl.searchParams;
    const agentId=searchParams.get("agentId");

    const user=await currentUser();

    if(!user){
        return NextResponse.json({error:"Unauthorize User"},{status:400});
    }


    const result=await db.select().from(AgentConfig)
    .where(eq(AgentConfig.agentId,agentId ?? ''));

    const agentConfig=result[0];
    const allowedTools=agentConfig?.tools;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const session=await getOrCreateAgentSession(agentConfig,user.primaryEmailAddress?.emailAddress);
}