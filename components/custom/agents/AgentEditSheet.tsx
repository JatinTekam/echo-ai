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
import { Link2, Link2Off, Plus, Shuffle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import axios from "axios";

type Props = {
  children: any;
  agentConfig: CreatedAgentType | null;
  setUpdatedAgent: any;
};

const availableTools = [
  { id: "google_search", name: "Google Search" },
  { id: "serp_search", name: "SERP Search" },
  { id: "browserbase", name: "Browserbase" },
  { id: "gmail", name: "Gmail" },
  { id: "slack", name: "Slack" },
  { id: "google_calendar", name: "Google Calendar" },
  { id: "notion", name: "Notion" },
];

const AgentEditSheet = ({ children, agentConfig, setUpdatedAgent }: Props) => {
  const [draftAgent, setDraftAgent] = useState<CreatedAgentType | null>(
    agentConfig,
  );
  const [newSkill, setNewSkill] = useState("");
  const [openSheet,setOpenSheet]=useState(false);

  const shuffleImage = () => {
    const randomSeed = crypto.randomUUID();
    const newImage =
      "https://api.dicebear.com/10.x/gaze/svg?tags=animation&seed=" +
      randomSeed;
    setDraftAgent((prev: any) => ({
      ...prev,
      agentImage: newImage,
    }));
  };

  const updateDraft = (key: string, value: string) => {
    setDraftAgent((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateSchedule = (
    updates: Partial<NonNullable<CreatedAgentType["schedule"]>>,
  ) => {
    setDraftAgent((prev) =>
      prev
        ? {
            ...prev,
            schedule: {
              ...prev.schedule,
              ...updates,
              type: updates.type ?? prev.schedule?.type ?? "manual",
            },
          }
        : prev,
    );
  };

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill) return;

    setDraftAgent((prev) =>
      prev
        ? {
            ...prev,
            skills: [...(prev.skills ?? []), skill],
          }
        : prev,
    );
    setNewSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    setDraftAgent((prev) =>
      prev
        ? {
            ...prev,
            skills: (prev.skills ?? []).filter(
              (skill) => skill !== skillToRemove,
            ),
          }
        : prev,
    );
  };

  const toggleTool = (toolId: string) => {
    setDraftAgent((prev) => {
      if (!prev) return prev;

      const tools = Array.isArray(prev.tools) ? (prev.tools as string[]) : [];
      return {
        ...prev,
        tools: tools.includes(toolId)
          ? tools.filter((tool) => tool !== toolId)
          : [...tools, toolId],
      };
    });
  };

  const handleSumbit =async (event: any) => {
    //Save To Database
    event.preventDefault();
    const result=await axios.put("/api/agent/configure",{
      ...draftAgent
    })

    setUpdatedAgent(draftAgent);

    toast.add({
      title: "Agent Updated",
      type: "success",
    });

    setOpenSheet(false);

  };

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger render={children} />
      <SheetContent>
        <form onSubmit={handleSumbit} className="flex min-h-0 flex-1 flex-col">
          <SheetHeader className="border-b py-4">
            <div className="flex items-center gap-2.5">
              <div>
                <Image
                  src={"/echo-logo.png"}
                  alt="logo"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <SheetTitle>Edit Agent</SheetTitle>
                <SheetDescription>
                  Update how this agent look, works and more
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="min-h-0 flex-1 p-5">
            <section className="flex gap-3 items-center border rounded-2xl bg-gray-50 p-3">
              <div>
                <img
                  src={draftAgent?.agentImage ?? ""}
                  alt={draftAgent?.name ?? ""}
                  width={88}
                  height={88}
                  className="bg-slate-100 p-2 border rounded-2xl size-20"
                />
              </div>
              <div className="space-y-2">
                <p className="font-medium">Agent Images </p>
                <p className="text-xs text-muted-foreground">
                  Shuffle to generate new look
                </p>
                <Button variant={"outline"} onClick={shuffleImage}>
                  <Shuffle />
                  Shuffle Image
                </Button>
              </div>
            </section>

            <div className="space-y-2 mt-2">
              <label htmlFor="">Agent Name</label>
              <Input
                value={draftAgent?.name}
                onChange={(event) => updateDraft("name", event.target.value)}
                placeholder="Give Your Agent Name"
                required
                className="mt-1"
              />
            </div>

            <div className="space-y-2 mt-4">
              <label htmlFor="agent-objective">Objective</label>
              <Textarea
                id="agent-objective"
                value={draftAgent?.objective ?? ""}
                onChange={(event) =>
                  updateDraft("objective", event.target.value)
                }
                placeholder="Describe the outcome this agent should achieve"
                className="mt-1 min-h-20"
              />
            </div>

            <div className="space-y-2 mt-4">
              <label htmlFor="agent-instructions">Instructions</label>
              <Textarea
                id="agent-instructions"
                value={draftAgent?.instructions ?? ""}
                onChange={(event) =>
                  updateDraft("instructions", event.target.value)
                }
                placeholder="Add step-by-step instructions for this agent"
                className="mt-1 min-h-32"
              />
            </div>

            <section className="mt-5 space-y-3 rounded-xl border p-3">
              <div>
                <h3 className="text-sm font-medium">Schedule</h3>
                <p className="text-xs text-muted-foreground">
                  Choose when and how often this agent runs.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="agent-run-type" className="text-sm">
                    Run type
                  </label>
                  <Select
                    value={draftAgent?.schedule?.type ?? "manual"}
                    onValueChange={(value) =>
                      value &&
                      updateSchedule({
                        type: value as "once" | "recurring" | "manual",
                      })
                    }
                  >
                    <SelectTrigger id="agent-run-type" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Once</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="agent-schedule-time" className="text-sm">
                    Time
                  </label>
                  <Input
                    id="agent-schedule-time"
                    type="time"
                    value={draftAgent?.schedule?.time ?? "09:00"}
                    onChange={(event) =>
                      updateSchedule({ time: event.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="agent-schedule-frequency" className="text-sm">
                  Frequency
                </label>
                <Select
                  value={draftAgent?.schedule?.frequency ?? "daily"}
                  onValueChange={(value) =>
                    value &&
                    updateSchedule({
                      frequency: value as
                        | "hourly"
                        | "daily"
                        | "weekly"
                        | "monthly",
                    })
                  }
                >
                  <SelectTrigger
                    id="agent-schedule-frequency"
                    className="w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>

            <section className="mt-5 space-y-3">
              <div>
                <h3 className="text-sm font-medium">Skills</h3>
                <p className="text-xs text-muted-foreground">
                  Add or remove capabilities this agent should use.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 rounded-xl border bg-gray-50 p-3">
                {(draftAgent?.skills ?? []).map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="inline-flex items-center gap-1 rounded-full border bg-white px-2.5 py-1 text-xs"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(event) => setNewSkill(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add a skill"
                  aria-label="New skill"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSkill}
                  disabled={!newSkill.trim()}
                >
                  <Plus /> Add
                </Button>
              </div>
            </section>

            <section className="mt-5 space-y-3">
              <div>
                <h3 className="text-sm font-medium">Connected Tools</h3>
                <p className="text-xs text-muted-foreground">
                  {
                    availableTools.filter((tool) =>
                      (draftAgent?.tools ?? []).includes(tool.id),
                    ).length
                  }{" "}
                  of {availableTools.length} connected
                </p>
              </div>

              <div className="space-y-2">
                {availableTools.map((tool) => {
                  const isConnected = (draftAgent?.tools ?? []).includes(
                    tool.id,
                  );

                  return (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between gap-3 rounded-xl border p-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${isConnected ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                        >
                          {isConnected ? (
                            <Link2 className="size-5" />
                          ) : (
                            <Link2Off className="size-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {tool.name}
                          </p>
                          <p
                            className={`text-xs ${isConnected ? "text-emerald-600" : "text-muted-foreground"}`}
                          >
                            {isConnected ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant={isConnected ? "outline" : "default"}
                        onClick={() => toggleTool(tool.id)}
                      >
                        {isConnected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="mt-5 space-y-2">
              <label
                htmlFor="agent-output-format"
                className="text-sm font-medium"
              >
                Output Format
              </label>
              <Textarea
                id="agent-output-format"
                value={draftAgent?.outputFormat ?? ""}
                onChange={(event) =>
                  updateDraft("outputFormat", event.target.value)
                }
                placeholder="A structured Markdown summary featuring a calendar timeline, top focus priorities, and a recommended time-blocked agenda."
                className="min-h-24"
              />
            </div>
          </ScrollArea>
          <SheetFooter className="border-t">
            <div className="flex justify-end gap-2.5">
              <Button variant={"outline"}>Cancel</Button>
              <Button className={"bg-purple-700"}>Save Changes</Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AgentEditSheet;
