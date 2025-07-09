// Integration utilities for connecting leads with projects and tracking value

export interface LeadToProjectMapping {
  leadId: string;
  projectId: string;
  conversionDate: string;
  originalEstimate: number;
  finalValue: number;
  conversionNotes?: string;
}

export interface ProjectRevenue {
  projectId: string;
  leadSource: string;
  acquisitionCost: number;
  customerLifetimeValue: number;
  profitMargin: number;
  referralGenerated: boolean;
  referralValue?: number;
}

export class LeadProjectIntegration {
  private static LEAD_MAPPINGS_KEY = "lead_project_mappings";
  private static PROJECT_REVENUE_KEY = "project_revenue_data";

  // Convert lead to project
  static convertLeadToProject(
    leadId: string,
    projectData: any,
    conversionNotes?: string,
  ): string {
    const projectId = `proj-${Date.now()}`;

    // Create lead-to-project mapping
    const mapping: LeadToProjectMapping = {
      leadId,
      projectId,
      conversionDate: new Date().toISOString(),
      originalEstimate: projectData.estimatedValue || 0,
      finalValue: projectData.actualValue || projectData.estimatedValue || 0,
      conversionNotes,
    };

    this.saveLeedMapping(mapping);

    // Update lead status to 'won'
    this.updateLeadStatus(leadId, "won");

    return projectId;
  }

  // Track project revenue data
  static trackProjectRevenue(
    projectId: string,
    revenueData: Omit<ProjectRevenue, "projectId">,
  ): void {
    const revenue: ProjectRevenue = {
      projectId,
      ...revenueData,
    };

    const existingData = this.getProjectRevenueData();
    const updatedData = existingData.filter((r) => r.projectId !== projectId);
    updatedData.push(revenue);

    localStorage.setItem(this.PROJECT_REVENUE_KEY, JSON.stringify(updatedData));
  }

  // Get conversion analytics
  static getConversionAnalytics(): {
    totalConversions: number;
    conversionRate: number;
    averageValueIncrease: number;
    totalRevenueFromLeads: number;
    leadSourcePerformance: Record<string, any>;
  } {
    const mappings = this.getLeadMappings();
    const revenueData = this.getProjectRevenueData();
    const leads = this.getLeads();

    const totalConversions = mappings.length;
    const totalLeads = leads.length;
    const conversionRate =
      totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;

    const averageValueIncrease =
      mappings.length > 0
        ? mappings.reduce(
            (sum, mapping) =>
              sum + (mapping.finalValue - mapping.originalEstimate),
            0,
          ) / mappings.length
        : 0;

    const totalRevenueFromLeads = mappings.reduce(
      (sum, mapping) => sum + mapping.finalValue,
      0,
    );

    // Analyze lead source performance
    const leadSourcePerformance: Record<string, any> = {};
    leads.forEach((lead) => {
      if (!leadSourcePerformance[lead.source]) {
        leadSourcePerformance[lead.source] = {
          totalLeads: 0,
          conversions: 0,
          totalValue: 0,
          conversionRate: 0,
        };
      }

      leadSourcePerformance[lead.source].totalLeads++;

      const mapping = mappings.find((m) => m.leadId === lead.id);
      if (mapping) {
        leadSourcePerformance[lead.source].conversions++;
        leadSourcePerformance[lead.source].totalValue += mapping.finalValue;
      }
    });

    // Calculate conversion rates for each source
    Object.keys(leadSourcePerformance).forEach((source) => {
      const data = leadSourcePerformance[source];
      data.conversionRate = (data.conversions / data.totalLeads) * 100;
      data.averageValue =
        data.conversions > 0 ? data.totalValue / data.conversions : 0;
    });

    return {
      totalConversions,
      conversionRate,
      averageValueIncrease,
      totalRevenueFromLeads,
      leadSourcePerformance,
    };
  }

  // Get project profitability analysis
  static getProjectProfitabilityAnalysis(): {
    projectsBySource: Record<string, number>;
    profitabilityBySource: Record<string, number>;
    costOfAcquisition: Record<string, number>;
    roi: Record<string, number>;
  } {
    const revenueData = this.getProjectRevenueData();
    const mappings = this.getLeadMappings();
    const leads = this.getLeads();

    const analysis = {
      projectsBySource: {} as Record<string, number>,
      profitabilityBySource: {} as Record<string, number>,
      costOfAcquisition: {} as Record<string, number>,
      roi: {} as Record<string, number>,
    };

    // Analyze by lead source
    revenueData.forEach((revenue) => {
      const mapping = mappings.find((m) => m.projectId === revenue.projectId);
      const lead = mapping ? leads.find((l) => l.id === mapping.leadId) : null;

      if (lead) {
        const source = lead.source;

        // Count projects by source
        analysis.projectsBySource[source] =
          (analysis.projectsBySource[source] || 0) + 1;

        // Sum profitability by source
        const profit = (mapping!.finalValue * revenue.profitMargin) / 100;
        analysis.profitabilityBySource[source] =
          (analysis.profitabilityBySource[source] || 0) + profit;

        // Sum acquisition costs
        analysis.costOfAcquisition[source] =
          (analysis.costOfAcquisition[source] || 0) + revenue.acquisitionCost;
      }
    });

    // Calculate ROI for each source
    Object.keys(analysis.profitabilityBySource).forEach((source) => {
      const profit = analysis.profitabilityBySource[source];
      const cost = analysis.costOfAcquisition[source] || 0;
      analysis.roi[source] = cost > 0 ? ((profit - cost) / cost) * 100 : 0;
    });

    return analysis;
  }

  // Lead scoring based on project potential
  static calculateLeadScore(lead: any): number {
    let score = 50; // Base score

    // Project value scoring (0-30 points)
    if (lead.estimatedValue >= 50000) score += 30;
    else if (lead.estimatedValue >= 25000) score += 20;
    else if (lead.estimatedValue >= 10000) score += 10;

    // Lead source scoring (0-20 points)
    const sourceScores: Record<string, number> = {
      referral: 20,
      website: 15,
      social: 10,
      advertising: 8,
      cold_call: 5,
      other: 5,
    };
    score += sourceScores[lead.source] || 5;

    // Priority scoring (0-15 points)
    const priorityScores: Record<string, number> = {
      urgent: 15,
      high: 12,
      medium: 8,
      low: 3,
    };
    score += priorityScores[lead.priority] || 5;

    // Probability scoring (0-20 points)
    score += (lead.probability / 100) * 20;

    // Engagement scoring (0-15 points)
    const activityCount = lead.activities?.length || 0;
    if (activityCount >= 5) score += 15;
    else if (activityCount >= 3) score += 10;
    else if (activityCount >= 1) score += 5;

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  // Predict project success probability
  static predictProjectSuccess(lead: any): {
    probability: number;
    factors: string[];
    recommendations: string[];
  } {
    const factors: string[] = [];
    const recommendations: string[] = [];
    let probability = 50;

    // Historical data analysis
    const analytics = this.getConversionAnalytics();
    const sourcePerformance = analytics.leadSourcePerformance[lead.source];

    if (sourcePerformance) {
      probability = (probability + sourcePerformance.conversionRate) / 2;
      if (sourcePerformance.conversionRate > 50) {
        factors.push(
          `Strong source performance (${sourcePerformance.conversionRate.toFixed(1)}%)`,
        );
      }
    }

    // Lead quality factors
    if (lead.estimatedValue > 20000) {
      probability += 15;
      factors.push("High-value project");
    }

    if (lead.source === "referral") {
      probability += 20;
      factors.push("Referral lead (higher trust)");
    }

    if (lead.priority === "urgent" || lead.priority === "high") {
      probability += 10;
      factors.push("High priority lead");
    }

    if (lead.activities?.length >= 3) {
      probability += 10;
      factors.push("High engagement level");
    }

    // Generate recommendations
    if (lead.probability < 30) {
      recommendations.push("Schedule follow-up call to increase engagement");
    }

    if (!lead.expectedCloseDate) {
      recommendations.push("Set clear timeline expectations");
    }

    if (lead.estimatedValue < 10000) {
      recommendations.push("Explore upselling opportunities");
    }

    if (lead.activities?.length < 2) {
      recommendations.push("Increase touchpoints to build relationship");
    }

    return {
      probability: Math.min(95, Math.max(5, Math.round(probability))),
      factors: factors.slice(0, 5), // Top 5 factors
      recommendations: recommendations.slice(0, 3), // Top 3 recommendations
    };
  }

  // Revenue forecasting
  static forecastRevenue(timeframeDays: number = 90): {
    projectedRevenue: number;
    conservativeEstimate: number;
    optimisticEstimate: number;
    leadContributions: Array<{
      leadId: string;
      leadName: string;
      projectedValue: number;
      probability: number;
    }>;
  } {
    const leads = this.getLeads();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + timeframeDays);

    const activeLeads = leads.filter((lead) => {
      if (["won", "lost"].includes(lead.status)) return false;
      if (!lead.expectedCloseDate) return true; // Include if no date set
      return new Date(lead.expectedCloseDate) <= cutoffDate;
    });

    let projectedRevenue = 0;
    let conservativeEstimate = 0;
    let optimisticEstimate = 0;

    const leadContributions = activeLeads.map((lead) => {
      const weightedValue = (lead.estimatedValue * lead.probability) / 100;
      projectedRevenue += weightedValue;

      // Conservative: reduce probability by 20%
      conservativeEstimate +=
        (lead.estimatedValue * Math.max(0, lead.probability - 20)) / 100;

      // Optimistic: increase probability by 20% and value by 10%
      optimisticEstimate +=
        (lead.estimatedValue * 1.1 * Math.min(100, lead.probability + 20)) /
        100;

      return {
        leadId: lead.id,
        leadName: lead.name,
        projectedValue: weightedValue,
        probability: lead.probability,
      };
    });

    // Sort by projected value
    leadContributions.sort((a, b) => b.projectedValue - a.projectedValue);

    return {
      projectedRevenue,
      conservativeEstimate,
      optimisticEstimate,
      leadContributions,
    };
  }

  // Private helper methods
  private static saveLeedMapping(mapping: LeadToProjectMapping): void {
    const existingMappings = this.getLeadMappings();
    const updatedMappings = existingMappings.filter(
      (m) => m.leadId !== mapping.leadId,
    );
    updatedMappings.push(mapping);
    localStorage.setItem(
      this.LEAD_MAPPINGS_KEY,
      JSON.stringify(updatedMappings),
    );
  }

  private static getLeadMappings(): LeadToProjectMapping[] {
    try {
      return JSON.parse(localStorage.getItem(this.LEAD_MAPPINGS_KEY) || "[]");
    } catch {
      return [];
    }
  }

  private static getProjectRevenueData(): ProjectRevenue[] {
    try {
      return JSON.parse(localStorage.getItem(this.PROJECT_REVENUE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  private static getLeads(): any[] {
    try {
      return JSON.parse(localStorage.getItem("leads") || "[]");
    } catch {
      return [];
    }
  }

  private static updateLeadStatus(leadId: string, status: string): void {
    try {
      const leads = this.getLeads();
      const updatedLeads = leads.map((lead) =>
        lead.id === leadId ? { ...lead, status } : lead,
      );
      localStorage.setItem("leads", JSON.stringify(updatedLeads));
    } catch (error) {
      console.error("Failed to update lead status:", error);
    }
  }
}

// Export commonly used functions
export const {
  convertLeadToProject,
  trackProjectRevenue,
  getConversionAnalytics,
  getProjectProfitabilityAnalysis,
  calculateLeadScore,
  predictProjectSuccess,
  forecastRevenue,
} = LeadProjectIntegration;
