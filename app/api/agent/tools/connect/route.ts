import { NextRequest } from "next/server";


export async function POST(req:NextRequest){
    const {toolSlug}=await req.json()
}