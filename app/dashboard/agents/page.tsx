import CreateAgent from "@/components/custom/agents/CreateAgent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function AgentsPage() {
  return (
    <div className="w-full flex justify-center">
        <div className="w-full max-w-3xl px-6 pt-18 pb-16">
      <Tabs defaultValue="create-agent" className="w-full">
        <TabsList >
          <TabsTrigger value="create-agent" className="hover:cursor-pointer">Create Agent</TabsTrigger>
          <TabsTrigger value="my-agent" className="hover:cursor-pointer">My Agents</TabsTrigger>
        </TabsList>
        <TabsContent value="create-agent">
          <CreateAgent/>
        </TabsContent>
        <TabsContent value="my-agent">
          My Agents
        </TabsContent>
      </Tabs>
    </div>
    </div>
  );
}

export default AgentsPage;
