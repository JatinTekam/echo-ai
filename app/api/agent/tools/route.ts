import { AgentConfig, db, tools as toolCatalog } from "@/db";
import { composio } from "@/lib/composio";
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

    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
        return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    if (!agentId) {
        return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
    }

    const [agentResult, catalogTools] = await Promise.all([
        db.select().from(AgentConfig).where(eq(AgentConfig.agentId, agentId)),
        db.select({
            slug: toolCatalog.slug,
            name: toolCatalog.name,
            logo: toolCatalog.icon,
        }).from(toolCatalog).where(eq(toolCatalog.enabled, true)),
    ]);

    const agentConfig = agentResult[0];
    if (!agentConfig) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const connectedAccounts = await composio.connectedAccounts.list({
        userIds: [userEmail],
        statuses: ["ACTIVE"],
        limit: 100,
    });
    const connectedToolkitSlugs = new Set(
        connectedAccounts.items.map((account) => account.toolkit.slug.toLowerCase()),
    );

    const availableTools = catalogTools.map((catalogTool) => {
        return {
            slug: catalogTool.slug,
            name: catalogTool.name,
            logo: catalogTool.logo ?? "",
            connected: connectedToolkitSlugs.has(catalogTool.slug.toLowerCase()),
        };
    });

    return NextResponse.json(availableTools);

}