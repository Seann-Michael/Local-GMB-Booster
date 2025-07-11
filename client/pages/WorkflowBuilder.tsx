import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";

export default function WorkflowBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflowName, setWorkflowName] = useState(
    id ? `Workflow ${id}` : "New Workflow",
  );

  const handleSave = () => {
    console.log("Saving workflow:", workflowName);
    // Here you would save to your backend
  };

  const handlePublish = () => {
    console.log("Publishing workflow:", workflowName);
    // Here you would publish the workflow
  };

  return (
    <AppLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        <WorkflowCanvas
          workflowName={workflowName}
          onWorkflowNameChange={setWorkflowName}
          onSave={handleSave}
          onPublish={handlePublish}
        />
      </div>
    </AppLayout>
  );
}
