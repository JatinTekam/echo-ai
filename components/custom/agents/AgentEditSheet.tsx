import React, { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CreatedAgentType } from "./CreateAgent";
import { Shuffle } from "lucide-react";

type Props={
    children: any,
    agentConfig: CreatedAgentType | null;
}

const AgentEditSheet = ({ children, agentConfig }: Props) => {

  const [draftAgent,setDraftAgent]=useState<CreatedAgentType | null>(agentConfig);

  const shuffleImage=()=>{
    const randomSeed=crypto.randomUUID();
    const newImage='https://api.dicebear.com/10.x/gaze/svg?tags=animation&seed='+randomSeed;
    setDraftAgent((prev:any)=>({
      ...prev,
      agentImage: newImage,
    }))
  }



  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader className="border-b py-4">
        <div className="flex items-center gap-2.5">
            <div>
                <Image src={'/logo.svg'} alt="logo" width={40} height={40}/>
            </div>
          <div>
            <SheetTitle>Edit Agent</SheetTitle>
            <SheetDescription>Update how this agent look, works and more</SheetDescription>
          </div>
        </div>
        </SheetHeader>

        <ScrollArea className="p-5">
            <section className="flex gap-3 items-center border rounded-2xl bg-gray-50 p-3">
                <div>
                    <img src={draftAgent?.agentImage ?? ""} alt={draftAgent?.name ?? ""} width={88} height={88}
                    className="bg-slate-100 p-2 border rounded-2xl size-200"/>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Agent Images </p>
                  <p className="text-xs text-muted-foreground">Shuffle to generate new look</p>
                  <Button variant={'outline'}
                  onClick={shuffleImage}
                  ><Shuffle/>Shuffle Image</Button>
                </div>
            </section>
        </ScrollArea>
        <SheetFooter className="border-t">
            <div className="flex justify-end gap-2.5">
            <Button variant={'outline'}>Cancel</Button>
            <Button className={'bg-purple-700'}>Save Changes</Button>
            </div>
        </SheetFooter>

      </SheetContent>
    </Sheet>
  );
};

export default AgentEditSheet;
