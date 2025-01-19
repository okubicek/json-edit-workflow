import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { config } from "@/config/config";
import { isValidGuid } from "@/utils/validation";

const WorkflowEditor = () => {
  const [workflowGuid, setWorkflowGuid] = useState("");
  const [jsonContent, setJsonContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRetrieve = async () => {
    if (!isValidGuid(workflowGuid)) {
      toast({
        title: "Invalid GUID",
        description: "Please enter a valid GUID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${config.apiDomain}/workflows/${workflowGuid}/state`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch workflow state");
      }

      const data = await response.json();
      setJsonContent(JSON.stringify(data, null, 2));
      
      toast({
        title: "Success",
        description: "Workflow state retrieved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retrieve workflow state",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isValidGuid(workflowGuid)) {
      toast({
        title: "Invalid GUID",
        description: "Please enter a valid GUID",
        variant: "destructive",
      });
      return;
    }

    try {
      let parsedJson;
      try {
        parsedJson = JSON.parse(jsonContent);
      } catch (e) {
        toast({
          title: "Invalid JSON",
          description: "Please enter valid JSON content",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      const response = await fetch(
        `${config.apiDomain}/workflows/${workflowGuid}/state`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedJson),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save workflow state");
      }

      toast({
        title: "Success",
        description: "Workflow state saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save workflow state",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto p-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Enter Workflow GUID"
            value={workflowGuid}
            onChange={(e) => setWorkflowGuid(e.target.value)}
            className="font-mono"
          />
        </div>
        <Button
          onClick={handleRetrieve}
          disabled={isLoading}
          className="min-w-[100px]"
        >
          {isLoading ? "Loading..." : "Retrieve"}
        </Button>
      </div>

      <Textarea
        value={jsonContent}
        onChange={(e) => setJsonContent(e.target.value)}
        placeholder="JSON content will appear here"
        className="min-h-[400px] font-mono"
      />

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="min-w-[100px]"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default WorkflowEditor;