import { CreatedAgentType } from "@/components/custom/agents/CreateAgent";
import { getOrCreateAgentSession } from "./get-agent-composio-agent-session";
import { Agent, setDefaultModelProvider } from "@openai/agents";
import { OpenAIProvider } from "@openai/agents-openai";

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


     Required Output Format:
     ${agentConfig.outputFormat}

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
        tools:[...composioTools,browserbase_tools]
    })
}
