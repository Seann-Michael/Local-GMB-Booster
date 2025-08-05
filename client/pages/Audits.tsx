import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/AppLayout";
import {
  ClipboardCheck,
  Clock,
  CheckCircle,
  FileSearch,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Audits() {
  const upcomingFeatures = [
    {
      icon: FileSearch,
      title: "Project Audits",
      description: "Comprehensive audits of project completion, quality standards, and documentation."
    },
    {
      icon: Users,
      title: "Team Performance Audits",
      description: "Evaluate team productivity, task completion rates, and collaboration effectiveness."
    },
    {
      icon: CheckCircle,
      title: "Quality Control Checks",
      description: "Automated quality assessments and compliance verification for all projects."
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Detailed audit reports with insights and recommendations for improvement."
    },
    {
      icon: Shield,
      title: "Security Audits",
      description: "Regular security assessments and vulnerability scans for your business data."
    },
  ];

  return (
    <AppLayout>
      <div className="w-full px-3 sm:px-4 py-6 max-w-full overflow-x-hidden min-w-0">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Audits</h1>
              <p className="text-muted-foreground">
                Comprehensive project and business auditing tools
              </p>
            </div>
          </div>
          
          <Badge variant="secondary" className="gap-2">
            <Clock className="h-4 w-4" />
            Coming Soon
          </Badge>
        </div>

        {/* Coming Soon Message */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Powerful Auditing Tools Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're building comprehensive auditing capabilities to help you maintain quality standards, 
              track compliance, and optimize your business operations. These tools will provide detailed 
              insights into project completion, team performance, and business metrics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link to="/admin/reports">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Current Reports
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/projects">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Back to Projects
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Features */}
        <div>
          <h2 className="text-xl font-semibold mb-4">What's Coming</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingFeatures.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Stay Updated</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We'll notify you as soon as the Audits feature becomes available. 
                  In the meantime, you can use our existing Reports section to track 
                  project progress and business metrics.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Badge variant="outline" className="w-fit">
                    Project Quality Tracking
                  </Badge>
                  <Badge variant="outline" className="w-fit">
                    Compliance Monitoring
                  </Badge>
                  <Badge variant="outline" className="w-fit">
                    Performance Analytics
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
