"use client";

import { ArrowUp, CirclePlus, MessageSquareText, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CreatedAgentType } from "./CreateAgent";

type Props = {
  agent?: CreatedAgentType | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const AgentChatDrawer = ({ agent, open = false, onOpenChange }: Props) => {
  const agentTitle = agent?.name || "Daily Schedule & Task Planner Pro";
  const agentDescription =
    agent?.description ||
    "Create a clear, prioritized focus plan and schedule for today based on calendar commitments and Gmail tasks.";

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: `Hi! I'm ${agentTitle}. What would you like me to work on?`,
    },
  ]);

  const hasPrompt = prompt.trim().length > 0;

  const greeting = useMemo(
    () => ({
      title: `Start a chat with ${agentTitle}`,
      subtitle: agentDescription,
    }),
    [agentDescription, agentTitle],
  );

  const handleSend = () => {
    if (!prompt.trim()) return;

    const userMessage = { id: Date.now(), role: "user", text: prompt.trim() };
    const followUp = {
      id: Date.now() + 1,
      role: "assistant",
      text: "Absolutely — I can help you organize today’s priorities and build a focused task plan.",
    };

    setMessages((prev) => [...prev, userMessage, followUp]);
    setPrompt("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="h-dvh max-h-dvh w-full max-w-[520px] gap-0 overflow-hidden border-0 bg-[#f7f7f5] p-0 shadow-[0_12px_40px_rgba(15,23,42,0.15)]"
      >
        <div className="flex min-h-0 flex-1 flex-col bg-[#f7f7f5]">
          <header className="flex shrink-0 items-center justify-between border-b border-[#eceae6] bg-[#f5f5f3] px-4 py-3">
            <div className="flex items-center gap-3">
              {agent?.agentImage ? (
                <Image
                  src={agent.agentImage}
                  alt={`${agentTitle} avatar`}
                  width={36}
                  height={36}
                  unoptimized
                  className="h-9 w-9 rounded-[12px] border object-cover"
                />
              ) : (
                <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[12px] bg-[#c6f3ee] shadow-inner shadow-white/70">
                  <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[4px] bg-[#47bfc1]" />
                  <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-[3px] bg-[#dffaf7]" />
                </div>
              )}

              <h1 className="text-[15px] font-semibold tracking-[-0.02em] text-[#141414]">
                {agentTitle}
              </h1>
            </div>
          </header>

          <main className="flex min-h-0 flex-1 flex-col bg-[#f7f7f5]">
            <div
              aria-label="Chat conversation"
              className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain px-4 pb-3 pt-3"
            >
              <div className="flex min-h-full flex-col justify-between">
                <div className="flex flex-1 flex-col justify-center">
                  <div className="mt-1 flex justify-center">
                    {agent ? (
                      <Image
                        src={agent.agentImage}
                        alt={`${agentTitle} avatar`}
                        width={32}
                        height={32}
                        unoptimized
                        className="h-12 w-14 shrink-0 rounded-full border object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#d8f1ef] text-[#2f8f90] shadow-inner shadow-white/60">
                        <Sparkles className="h-7 w-7" />
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col items-center text-center">
                    <h2 className="text-[18px] font-medium text-[#1d1d1d]">
                      {greeting.title}
                    </h2>
                    <p className="mt-2 max-w-[420px] text-[14px] leading-5 text-[#5d5d5d]">
                      {greeting.subtitle}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 space-y-4 pb-1">
                  {messages.map((message) => {
                    const isAssistant = message.role === "assistant";

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                      >
                        {!isAssistant && (
                          <div className="max-w-[78%] rounded-[20px] rounded-br-[8px] bg-[#d7f3ed] px-4 py-3 text-[14px] leading-5 text-[#0f172a] shadow-sm">
                            {message.text}
                          </div>
                        )}

                        {isAssistant && (
                          <div className="flex max-w-[86%] items-end gap-3">
                            {agent?.agentImage ? (
                              <Image
                                src={agent.agentImage}
                                alt={`${agentTitle} avatar`}
                                width={32}
                                height={32}
                                unoptimized
                                className="h-8 w-8 shrink-0 rounded-full border object-cover"
                              />
                            ) : (
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c6f3ee] text-[#1b7d87]">
                                <div className="h-4 w-4 rounded-[4px] bg-[#3bb7b0]" />
                              </div>
                            )}
                            <div className="rounded-[18px] rounded-bl-[8px] bg-[#eef0ef] px-4 py-3 text-[14px] leading-5 text-[#1d1d1d] shadow-sm">
                              {message.text}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-[#e4e3e0] bg-[#f5f5f3] px-3 pb-3 pt-2">
              <div className="flex items-end gap-3 rounded-[18px] border border-[#d9d8d6] bg-[#f9f9f7] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <div className="flex items-center gap-2 px-1">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2f0f4] text-[#5f6470] transition hover:bg-[#ebedf0]"
                  >
                    <CirclePlus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2f0f4] text-[#5f6470] transition hover:bg-[#ebedf0]"
                  >
                    <MessageSquareText className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1">
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    rows={1}
                    placeholder={`Message ${agentTitle}...`}
                    className="max-h-28 min-h-[44px] w-full resize-none border-0 bg-transparent px-2 py-2 text-[14px] text-[#1f2937] placeholder:text-[#8a8a8a] focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!hasPrompt}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
                    hasPrompt
                      ? "bg-[#1abcd3] text-white shadow-md shadow-[#1abcd3]/40 hover:bg-[#16b7cb]"
                      : "bg-[#e5e5e5] text-[#9aa0a6]"
                  }`}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </main>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AgentChatDrawer;
