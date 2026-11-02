import { AgentConfig, db } from "@/db";
import { getOrCreateAgentSession } from "@/lib/get-agent-composio-agent-session";
import { composio } from "@/lib/composio";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { toolSlug, agentId } = await req.json();
    const user = await currentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
        return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    const agentConfig = await db.select().from(AgentConfig).where(
        and(eq(AgentConfig.agentId, agentId), eq(AgentConfig.userEmail, userEmail)),
    );
    if (!agentConfig[0]) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    const session = await getOrCreateAgentSession(agentConfig[0], userEmail);

    const connectionRequest = await session.authorize(toolSlug);

    return NextResponse.json({
        redirectUrl: connectionRequest.redirectUrl
    });
}

export async function DELETE(req: NextRequest) {
   
    const{toolSlug,agentId}=await req.json();

    const result=await db.select().from(AgentConfig)
                .where(eq(AgentConfig.agentId,agentId));

    const composioSession=result[0].composioSessionId;
    const session=await composio.use(composioSession??'')
    const toolKits=await session.toolkits();

    const toolKit=toolKits.items.find((item)=>item.slug.toLowerCase()===toolSlug.toLowerCase());

    const sessionConnectedAccountId=toolKit?.connection?.connectedAccount?.id ?? null;

    if(!sessionConnectedAccountId){
        return NextResponse.json({error:"Connection Not Found"},{status:404})
    }

    await composio.connectedAccounts.delete(sessionConnectedAccountId);

    return NextResponse.json({success:true})
}