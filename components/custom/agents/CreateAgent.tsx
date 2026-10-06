"use client"

import { Button } from "@/components/ui/button"
import axios from "axios";
import { ArrowUp, BarChart3, Bot, BriefcaseBusiness, Code2, Headphones, Loader2, Loader2Icon, PenLine, Plus } from "lucide-react"
import { useState } from "react";
import AIAgentQuestion from "./AIAgentQuestion";


const quickSuggestion = [
  {
    label: 'Research assistant',
    prompt: 'Create an agent that researches a topic, compares reliable sources, and summarizes the key findings.',
  },
  {
    label: 'Content writer',
    prompt: 'Create an agent that writes clear, engaging content in my preferred tone and format.',
  },
  {
    label: 'Customer support agent',
    prompt: 'Create an agent that answers customer questions, troubleshoots common issues, and escalates complex cases.',
  },
  {
    label: 'Task planner',
    prompt: 'Create an agent that breaks large goals into actionable steps, priorities, and deadlines.',
  },
  {
    label: 'Data analyst',
    prompt: 'Create an agent that analyzes data, identifies trends, and explains insights in simple language.',
  },
]

const templates = [
  {
    title: 'Personal assistant',
    description: 'Organize tasks, answer questions, and help manage your daily workflow.',
    icon: Bot,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700',
    border: 'border-purple-200',
    glow: 'shadow-purple-100',
  },
  {
    title: 'Business strategist',
    description: 'Turn business goals into practical strategies, plans, and next steps.',
    icon: BriefcaseBusiness,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    border: 'border-blue-200',
    glow: 'hover:shadow-blue-100',
  },
  {
    title: 'Content creator',
    description: 'Draft engaging content for blogs, social media, and marketing campaigns.',
    icon: PenLine,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-700',
    border: 'border-pink-200',
    glow: 'hover:shadow-pink-100',
  },
  {
    title: 'Data analyst',
    description: 'Explore data, find meaningful trends, and explain insights clearly.',
    icon: BarChart3,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    border: 'border-emerald-200',
    glow: 'hover:shadow-emerald-100',
  },
  {
    title: 'Support specialist',
    description: 'Resolve customer questions with clear, helpful, and consistent responses.',
    icon: Headphones,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    border: 'border-amber-200',
    glow: 'hover:shadow-amber-100',
  },
  {
    title: 'Coding assistant',
    description: 'Write, review, debug, and explain code across your development workflow.',
    icon: Code2,
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-700',
    border: 'border-cyan-200',
    glow: 'hover:shadow-cyan-100',
  },
]

type AgentConfigResp = {
  status: 'needs_clarification' | 'ready',
  clarificationQuestions: ClearificationQuestions[],
  config: any
}

export type ClearificationQuestions = {
  id: string
  question: string
  type: "single_select" | "multi_select" | "text" | "number" | "date" | "time",
  options: string[],
  allowCustom: boolean,
  customPlaceholder: string
}

const CreateAgent = () => {

    const [prompt,setPrompt]=useState("");
    const [configResult,setConfigResult]=useState<AgentConfigResp | null>(null);
    const [loading,setLoading]=useState(false);

    const OnSubmit=async()=>{
      setLoading(true);
      const result=await axios.post('/api/agent/configure',{
        prompt: prompt
      })

      console.log(result.data);
      setConfigResult(result.data);
      setLoading(false);
    }

    const onComplete=async(resp:any)=>{
      console.log("OnComplete",resp);
      setConfigResult(null);
      const updatedPrompt=prompt+ "/n"+ JSON.stringify(resp);

       setLoading(true);
      const result=await axios.post('/api/agent/configure',{
        prompt: updatedPrompt
      })

      console.log(result.data);
      setConfigResult(result.data);
      setLoading(false);
    }

  return (
    <div className='mt-5'>
      <div>
        <h2 className='text-2xl font-semibold tracking-wide'>Create New Agent</h2>
        <p className='mt-1 text-sm text-muted-foreground'>Ask what type of agent you want to create, Type your goal, task, or workflow</p>
      </div>

      <div className="w-full border rounded-2xl bg-background p-3 mt-3 shadow-lg shadow-purple-100
      hover:shadow-purple-200
      ">
        <textarea placeholder="Describe the agent you want to create..."
        value={prompt} onChange={e=>setPrompt(e.target.value)}
        className="min-h-[90px] w-full resize-none bg-transparent px-2 py-2 text-sm outline-none"
        />
        <div className="flex justify-between items-center">
            <div>
                <Button variant={'ghost'} size={'icon'} className='cursor-pointer'>
                    <Plus/>
                </Button>
            </div>
            <Button disabled={loading} onClick={OnSubmit} size={'icon'} className={`h-9 w-9 rounded-full bg-purple-900 cursor-pointer`}>
                {loading ? <Loader2 className='animate-spin'/> :  <ArrowUp/>}
            </Button>
        </div>
      </div>

      <div className='mt-3 flex gap-2'>
        {quickSuggestion.map((suggestion,index)=>(
            <Button
            onClick={()=>setPrompt(suggestion.prompt)}
             variant={'outline'} 
             key={suggestion.label} 
             className='hover:text-purple-700 hover:bg-purple-200 hover:border-purple-700 hover:cursor-pointer'>{suggestion.label}</Button>
        ))}
      </div>


      { loading ? <div className="flex gap-2 items-center p-5 mt-7 border rounded-xl shadow">
        <Loader2Icon className="animate-spin"/>
        <h2>Generating agent Config...</h2>
      </div>
        :
       !configResult && <div className="mt-10">
            <h2 className="flex text-lg justify-between items-center font-semibold">Get Started <span className="text-sm font-medium">View All</span></h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-3">
              {
                templates.map((template,index)=>(
                  <div key={index} className={`border rounded-2xl p-5 hover:cursor-pointer hover:shadow-lg ${template.border} ${template.glow}`}>
                    <template.icon className={`h-11 w-11 p-2 ${template.iconBg} ${template.iconColor} rounded-xl`}/>
                    <div className="mt-6">
                      <h2 className="font-semibold text-foreground">{template.title}</h2>
                      <p className="text-sm mt-2 leading-5 text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                ))
              }
            </div>
        </div> }

        {configResult &&
          <div className="p-5 border rounded-2xl mt-8">
            {configResult.status === "needs_clarification" && (
              <AIAgentQuestion questionList={configResult.clarificationQuestions}
                onComplete={(resp:any)=>onComplete(resp)}
              />
            )}
          </div>

}
<div>{JSON.stringify(configResult)}</div>

    </div>
    )
}

export default CreateAgent
