"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { CreatedAgentType } from './CreateAgent';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Ellipsis, Pause, Pencil, Play, Trash } from 'lucide-react';

const MyAgents = () => {
  const [myAgents,setMyAgents]=useState<CreatedAgentType[] | null>();

  useEffect(()=>{
    AllUsersAgents();
  },[])

  const AllUsersAgents=async()=>{
    const result=await axios.get("/api/agent/configure");
    console.log(result);
    setMyAgents(result.data);
  }

  return (
    <div className='mt-5'>
      <h2 className='font-bold text-xl'>My Agents</h2>
      <p className='text-sm text-muted-foreground mt-1'>Run, Manage And Update All The Agents You've Created.</p>
      <div>
        {
          myAgents?.map((agent,index)=>(
            <div>
              <div>
                <img src={agent?.agentImage} alt={agent.name} width={30} height={30}
                 className='p-2 border size-16 rounded-xl bg-slate-100' />
                 <div>
                  <DropdownMenu>
                            <DropdownMenuTrigger >
                          <Button variant={"ghost"} size={"icon"}>
                            <Ellipsis />
                          </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuGroup>
                                
                                <DropdownMenuItem><Play/> Run Now </DropdownMenuItem>
                                <DropdownMenuItem><Pause/> Pause Agent </DropdownMenuItem>
                                <DropdownMenuItem><Pencil/> Edit Agent </DropdownMenuItem>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup> 
                                <DropdownMenuItem variant={'destructive'}><Trash/> Delete Agent</DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                 </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyAgents
