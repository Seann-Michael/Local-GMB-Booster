import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgencyAdminLayout } from "@/components/AgencyAdminLayout";
import {
  DollarSign,
  CreditCard,
  Calendar,
  Download,
  Users,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  Edit,
} from "lucide-react";
import { useState, useEffect } from "react";

interface BillingHistory {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  invoiceUrl?: string;
}

interface PlanTier {
  name: string;
  maxUsers: number;
  pricePerUser: number;
  features: string[];
  recommended?: boolean;
}

export default function AgencyBilling() {
  const [currentPlan, setCurrentPlan] = useState({
    name: "Professional",
    maxUsers: 10,
    currentUsers: 3,
    pricePerUser: 49,
    nextBillDate: "2024-04-15",
    status: "active",
  });

  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [availablePlans, setAvailablePlans] = useState<PlanTier[]>([]);

  useEffect(() => {
    // Initialize billing data
    const sampleHistory: BillingHistory[] = [
      {
        id: "1",
        date: "2024-03-15",
        description: "Professional Plan - 3 Users",
        amount: 147,
        status: "paid",
        invoiceUrl: "#",
      },
      {
        id: "2",
        date: "2024-02-15",
        description: "Professional Plan - 3 Users",
        amount: 147,
        status: "paid",
        invoiceUrl: "#",
      },
      {
        id: "3",
        date: "2024-01-15",
        description: "Professional Plan - 2 Users",
        amount: 98,
        status: "paid",
        invoiceUrl: "#",
      },
    ];

    const plans: PlanTier[] = [
      {
        name: "Starter",
        maxUsers: 5,
        pricePerUser: 39,
        features: [
          "Up to 5 admin users",
          "Basic client management",
          "Standard support",
          "Monthly reporting",
        ],
      },
      {
        name: "Professional",
        maxUsers: 15,
        pricePerUser: 49,
        features: [
          "Up to 15 admin users",
          "Advanced client management",
          "Priority support",
          "Real-time analytics",
          "Custom branding",
          "Tiered discounts after 5 users",
        ],
        recommended: true,
      },
      {
        name: "Enterprise",
        maxUsers: 50,
        pricePerUser: 39, // Discounted rate for enterprise
        features: [
          "Up to 50 admin users",
          "Full feature access",
          "24/7 priority support",
          "White-label solution",
          "Advanced integrations",
          "Volume discounts",
          "Dedicated account manager",
        ],
      },
    ];

    setBillingHistory(sampleHistory);
    setAvailablePlans(plans);
  }, []);

  const calculateMonthlyTotal = () => {
    const baseUsers = Math.min(currentPlan.currentUsers, 5);
    const additionalUsers = Math.max(currentPlan.currentUsers - 5, 0);

    // Tiered pricing: first 5 users at full price, additional users at 80%
    const baseTotal = baseUsers * currentPlan.pricePerUser;
    const additionalTotal = additionalUsers * currentPlan.pricePerUser * 0.8;

    return baseTotal + additionalTotal;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { variant: "default" as const, label: "Paid", icon: CheckCircle },
      pending: {
        variant: "outline" as const,
        label: "Pending",
        icon: AlertCircle,
      },
      failed: {
        variant: "destructive" as const,
        label: "Failed",
        icon: AlertCircle,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <AgencyAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Billing & Subscription</h1>
            <p className="text-muted-foreground">
              Manage your agency plan and billing information
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Invoice
            </Button>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Update Payment Method
            </Button>
          </div>
        </div>

        {/* Current Plan Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Plan
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentPlan.name}</div>
              <p className="text-xs text-muted-foreground">
                {currentPlan.currentUsers}/{currentPlan.maxUsers} users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${calculateMonthlyTotal().toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Next bill:{" "}
                {new Date(currentPlan.nextBillDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Slots
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentPlan.maxUsers - currentPlan.currentUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                Add more admin users anytime
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Breakdown</CardTitle>
            <CardDescription>
              Understand how your monthly bill is calculated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Base Users (1-5)</h4>
                  <p className="text-sm text-muted-foreground">
                    {Math.min(currentPlan.currentUsers, 5)} users × $
                    {currentPlan.pricePerUser}/month
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    $
                    {(
                      Math.min(currentPlan.currentUsers, 5) *
                      currentPlan.pricePerUser
                    ).toFixed(0)}
                  </div>
                </div>
              </div>

              {currentPlan.currentUsers > 5 && (
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-green-800">
                      Additional Users (6+)
                    </h4>
                    <p className="text-sm text-green-700">
                      {currentPlan.currentUsers - 5} users × $
                      {(currentPlan.pricePerUser * 0.8).toFixed(0)}/month (20%
                      discount)
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-800">
                      $
                      {(
                        (currentPlan.currentUsers - 5) *
                        currentPlan.pricePerUser *
                        0.8
                      ).toFixed(0)}
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Monthly Total</span>
                  <span>${calculateMonthlyTotal().toFixed(0)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Billed monthly • Next bill date:{" "}
                  {new Date(currentPlan.nextBillDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>
              Upgrade or downgrade your plan based on your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {availablePlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-6 border rounded-lg relative ${
                    plan.recommended ? "border-blue-500 bg-blue-50" : ""
                  } ${plan.name === currentPlan.name ? "ring-2 ring-green-500" : ""}`}
                >
                  {plan.recommended && (
                    <Badge className="absolute -top-2 left-4 bg-blue-500">
                      Recommended
                    </Badge>
                  )}
                  {plan.name === currentPlan.name && (
                    <Badge className="absolute -top-2 right-4 bg-green-500">
                      Current Plan
                    </Badge>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">
                          ${plan.pricePerUser}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          /user/month
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Up to {plan.maxUsers} admin users
                      </p>
                    </div>

                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      variant={
                        plan.name === currentPlan.name ? "secondary" : "default"
                      }
                      disabled={plan.name === currentPlan.name}
                    >
                      {plan.name === currentPlan.name
                        ? "Current Plan"
                        : "Upgrade"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              View your past invoices and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>
                        {new Date(bill.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{bill.description}</TableCell>
                      <TableCell className="font-medium">
                        ${bill.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(bill.status)}</TableCell>
                      <TableCell>
                        {bill.invoiceUrl && (
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>
              Manage your payment methods and billing details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">
                        Expires 12/25
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      Update
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Billing Address</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Digital Marketing Pro</p>
                    <p>123 Business St</p>
                    <p>San Francisco, CA 94105</p>
                    <p>United States</p>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2">
                    Update Address
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Next Payment</h4>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Amount Due:</span>
                      <span className="font-medium">
                        ${calculateMonthlyTotal().toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Due Date:</span>
                      <span className="font-medium">
                        {new Date(
                          currentPlan.nextBillDate,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Auto-renewal</h4>
                  <p className="text-sm text-muted-foreground">
                    Your subscription will automatically renew on{" "}
                    {new Date(currentPlan.nextBillDate).toLocaleDateString()}.
                    You can cancel anytime.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Manage Auto-renewal
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AgencyAdminLayout>
  );
}
