import { CreatedAgentType } from "@/components/custom/agents/CreateAgent";
import { getOrCreateAgentSession } from "./get-agent-composio-agent-session";
import { Agent, setDefaultModelProvider } from "@openai/agents";
import { OpenAIProvider } from "@openai/agents-openai";
import { browserbaseResearchTool } from "./browserbase-tool";

const defaultModel = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";

// Point the Agents SDK at OpenRouter instead of the OpenAI API.
// OpenRouter speaks the OpenAI Chat Completions API, so the Responses API
// (the SDK default) is disabled here.
const openrouterProvider = process.env.OPENROUTER_API_KEY
    ? new OpenAIProvider({
          apiKey: process.env.OPENROUTER_API_KEY,
          baseURL: "https://openrouter.ai/api/v1",
          useResponses: false,
      })
    : null;

if (openrouterProvider) {
    setDefaultModelProvider(openrouterProvider);
}

export async function buildAgent(agentConfig:CreatedAgentType,
    userEmail: string
){
    const session=await getOrCreateAgentSession(agentConfig,userEmail);
    const composioTools=await session.tools();

    const instructions=`
    Role: ${agentConfig.description},

    Instructions: ${agentConfig.instructions},

     Primary Objective
     ${agentConfig.objective},

     Skills:
     ${agentConfig.skills??[].join(', ')},

     **Response Rendering Rules:**

- Use the configured output format for normal text answers: ${agentConfig.outputFormat}.
- When the user asks for UI, UX, layout, HTML, a component, or a page, provide a complete and functional implementation.
- Put the complete HTML snippet inside one fenced html code block.
- For visual UI responses, do not return Markdown-only content. You must provide the actual HTML implementation so the user can see the visual result.
- Inline CSS inside a <style> tag is allowed and recommended for creating polished, self-contained UI designs.

**Browser Research Rules:**

- Use browser_research when the user explicitly asks to search or browse the internet.
- Use browser_research for current prices, availability, comparisons, news, and other time-sensitive information.
- Do not claim that pricing is current unless browser_research verified it.
- Include the source URLs returned by browser_research in the final answer.
- Clearly distinguish verified facts from conclusions or recommendations.
- Browser research is read-only. Never use it to purchase, log in, submit forms, upload files, download files, or modify external systems.


     Use only the available tools when needed.
     Do not claim that an action succeeded unless the tool result confirms it.
     Ask for confirmation before destructive or high-risk actions.
    `.trim();

    const model = openrouterProvider
        ? await openrouterProvider.getModel(defaultModel)
        : undefined;

    return new Agent({
        name: agentConfig.name,
        model,
        instructions,
        tools:[...composioTools,browserbaseResearchTool]
    })
}
