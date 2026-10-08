import { NextRequest, NextResponse } from "next/server";
import {GoogleGenAI, ThinkingLevel} from "@google/genai";
import { AgentConfigSystemPrompt } from "@/data/prompt";
import { AgentConfigRespSchema } from "@/data/ReponseSchema";
import { AgentConfig, db, tools } from "@/db";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req:NextRequest){

    const {prompt}=await req.json();
    const user=await currentUser();

    if(!prompt.trim()){
        return NextResponse.json({error:"Prompt is required"},{status:400});
    }

    const apiKey=process.env.GOOGLE_CLOUD_GEMINI_API_KEY;

    try {

        const aiTools=await db.select({
            slug:tools.slug
        }).from(tools);

        const ai=new GoogleGenAI({apiKey});

        const response=await ai.models.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents: AgentConfigSystemPrompt.replace("{USER_PROMPT}", prompt).replace("{AVAILABLE_TOOLS}",aiTools.toString()),
            config: {
                thinkingConfig:{thinkingLevel:ThinkingLevel.MEDIUM},
                responseMimeType: "application/json",
                responseSchema: AgentConfigRespSchema
            }
        })

        const aiOutput=JSON.parse(response.text??'{}');

        if(aiOutput.status=='ready'){
            const agentId=crypto.randomUUID();
            const dbResult=await db.insert(AgentConfig).values({
                ...aiOutput.config,
                agentImage: 'https://api.dicebear.com/10.x/gaze/svg?tags=animation&seed='+agentId,
                agentId: agentId,
                userEmail: user?.primaryEmailAddress?.emailAddress,
            }).returning();

            return NextResponse.json({...dbResult[0],status_:'ready'});
        }

        return NextResponse.json(JSON.parse(response.text??'{}'));

    } catch (error) {
        console.error('Error',error);
        return NextResponse.json({error:error},{status:500});
    }
}