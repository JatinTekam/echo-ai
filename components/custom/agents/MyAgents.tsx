"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CreatedAgentType } from "./CreateAgent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CalendarClockIcon, Ellipsis, Loader2, Pause, Pencil, Play, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AgentEditSheet from "./AgentEditSheet";

const fetchAgents = async () => {
  const result = await axios.get<CreatedAgentType[]>("/api/agent/configure");
  return result.data;
};

const MyAgents = () => {
  const [myAgents, setMyAgents] = useState<CreatedAgentType[] | null>();
  const [loading,setLoading]=useState<boolean>(true);
  const [openEditAgentSheet,setOpenEditAgentSheet]=useState<boolean>(false);
  const [selectedEditAgent,setSelectedEditAgent]=useState<CreatedAgentType | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchAgents()
      .then((agents) => {
        if (!isMounted) return;
        setMyAgents(agents);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        console.error("Failed to load agents:", error);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshAgents = async () => {
    try {
      setMyAgents(await fetchAgents());
    } catch (error) {
      console.error("Failed to refresh agents:", error);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="font-bold text-xl">My Agents</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Run, Manage And Update All The Agents You&apos;ve Created.
      </p>
     {
      loading ? (<div className="h-[250px] flex gap-2 justify-center items-center"><Loader2 className="animate-spin"/>Loading...</div>)  : ( <div className="grid grid-cols-2 2xl:grid-cols-2 gap-5 mt-5">
        {myAgents?.map((agent) => (
          <div key={agent.id} className="p-2 border rounded-2xl">
            <div className="flex justify-between items-center ">
              <Image
                src={agent.agentImage}
                alt={agent.name}
                width={64}
                height={64}
                unoptimized
                className="p-2 border size-16 rounded-xl bg-slate-100"
              />
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant={"ghost"} size={"icon"}>
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Play /> Run Now{" "}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pause /> Pause Agent{" "}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={()=>{setOpenEditAgentSheet(true); setSelectedEditAgent(agent)}}>
                        <Pencil /> Edit Agent{" "}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem variant={"destructive"}>
                        <Trash /> Delete Agent
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="my-2">
              <h2 className="font-bold flex gap-2">{agent.name} <span className="font-normal text-green-700 bg-green-100 px-2 py-0.5 rounded-2xl">{agent.status}</span></h2>
              <p className="line-clamp-1 mt-1">{agent?.description}</p>
              <div className="flex gap-1 items-center mt-4">
                <CalendarClockIcon className="h-4 w-4 text-purple-700"/>
                <p className="text-xs text-muted-foreground">{agent?.schedule?.frequency}
                  {agent?.schedule?.type==='recurring' && <span> &nbsp; at {agent?.schedule?.time}</span>}</p>
              </div>
              <Separator className={'my-3'}/>
              <Button className={'bg-black w-full mt-2 cursor-pointer'}><Play/> Run Agent</Button>
            </div>
           
          </div>
        ))}
        { openEditAgentSheet &&
             <AgentEditSheet
            agentConfig={selectedEditAgent}
            setUpdatedAgent={refreshAgents}
            openEditSheet={openEditAgentSheet}
            closeSheet={(val:boolean)=>setOpenEditAgentSheet(val)}/>
           }
      </div>)
     }
    </div>
  );
};

export default MyAgents;
