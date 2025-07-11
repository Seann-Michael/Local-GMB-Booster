import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { WorkflowBuilder as WorkflowBuilderComponent } from "@/components/automation/WorkflowBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Play,
  Settings,
  Eye,
  Download,
  Upload,
} from "lucide-react";

export default function WorkflowBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [workflowStatus, setWorkflowStatus] = useState("draft");

  const handleSave = () => {
    console.log("Saving workflow...");
    // Save workflow logic here
  };

  const handlePublish = () => {
    console.log("Publishing workflow...");
    setWorkflowStatus("active");
    // Publish workflow logic here
  };

  const handleTest = () => {
    console.log("Testing workflow...");
    // Test workflow logic here
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b bg-background p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin/automations")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Workflow Builder</h1>
                <p className="text-sm text-muted-foreground">
                  {id ? `Editing workflow ${id}` : "Creating new workflow"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleTest}>
                <Eye className="h-4 w-4 mr-2" />
                Test
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" onClick={handlePublish}>
                <Play className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        {/* Workflow Settings Panel */}
        <div className="border-b bg-muted/30 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input
                id="workflow-name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Enter workflow name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-description">Description</Label>
              <Input
                id="workflow-description"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-status">Status</Label>
              <Select value={workflowStatus} onValueChange={setWorkflowStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Workflow Builder Canvas */}
        <div className="flex-1 bg-background">
          <WorkflowBuilderComponent
            workflowId={id}
            onSave={handleSave}
            onPublish={handlePublish}
          />
        </div>
      </div>
    </AppLayout>
  );
}
