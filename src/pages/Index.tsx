import WorkflowEditor from "@/components/WorkflowEditor";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Workflow State Editor</h1>
        <WorkflowEditor />
      </div>
    </div>
  );
};

export default Index;