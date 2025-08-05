import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgencyLayout } from "@/components/AgencyLayout";
import {
  ClipboardCheck,
  Clock,
  CheckCircle,
  FileSearch,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AgencyAudits() {
  const upcomingFeatures = [
    {
      icon: Building2,
      title: "Client Business Audits",
      description:
        "Comprehensive audits of all client businesses, their projects, and performance metrics.",
    },
    {
      icon: FileSearch,
      title: "Multi-Client Project Audits",
      description:
        "Cross-client project analysis and quality assessments across your entire portfolio.",
    },
    {
      icon: Users,
      title: "Agency Team Performance",
      description:
        "Evaluate your agency team's productivity and effectiveness across all client accounts.",
    },
    {
      icon: CheckCircle,
      title: "Client Compliance Tracking",
      description:
        "Monitor compliance and quality standards across all managed client businesses.",
    },
    {
      icon: BarChart3,
      title: "Agency Performance Analytics",
      description:
        "Detailed reports on agency performance, client satisfaction, and growth metrics.",
    },
    {
      icon: Shield,
      title: "Security & Access Audits",
      description:
        "Regular security assessments for agency access to client data and systems.",
    },
  ];

  return (
    <AgencyLayout>
      <div className="w-full px-3 sm:px-4 py-6 max-w-full overflow-x-hidden min-w-0">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Agency Audits</h1>
              <p className="text-muted-foreground">
                Comprehensive auditing tools for agency and client management
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
            <CardTitle className="text-xl">
              Advanced Agency Auditing Tools Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're developing specialized auditing capabilities designed
              specifically for agencies managing multiple client businesses.
              These tools will help you maintain quality standards across your
              entire client portfolio, track compliance, and optimize your
              agency operations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link to="/agency/admin/reports">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Current Reports
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/agency/admin/analytics">
                  <Building2 className="h-4 w-4 mr-2" />
                  Agency Analytics
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/agency/admin/projects">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Back to Projects
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Features */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            What's Coming for Agencies
          </h2>
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

        {/* Agency-Specific Info */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Agency-First Design</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our auditing tools are being designed specifically for
                  agencies managing multiple client businesses. You'll be able
                  to audit across your entire client portfolio, compare
                  performance metrics, and ensure consistent quality standards.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Badge variant="outline" className="w-fit">
                    Multi-Client Monitoring
                  </Badge>
                  <Badge variant="outline" className="w-fit">
                    Agency Performance Tracking
                  </Badge>
                  <Badge variant="outline" className="w-fit">
                    Client Compliance Reports
                  </Badge>
                  <Badge variant="outline" className="w-fit">
                    Cross-Portfolio Analytics
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AgencyLayout>
  );
}
