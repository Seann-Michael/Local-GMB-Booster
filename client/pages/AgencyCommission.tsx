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
  TrendingUp,
  Calendar,
  Download,
  CreditCard,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

interface CommissionPayment {
  id: string;
  month: string;
  year: number;
  totalRevenue: number;
  commissionRate: number;
  commissionAmount: number;
  status: "paid" | "pending" | "processing";
  paidDate?: string;
  dueDate: string;
  clientCount: number;
}

interface ClientCommission {
  clientId: string;
  clientName: string;
  plan: string;
  monthlyValue: number;
  commissionAmount: number;
  status: "active" | "inactive";
}

export default function AgencyCommission() {
  const [payments, setPayments] = useState<CommissionPayment[]>([]);
  const [clientCommissions, setClientCommissions] = useState<
    ClientCommission[]
  >([]);
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [totalStats, setTotalStats] = useState({
    currentMonth: 0,
    lastMonth: 0,
    yearToDate: 0,
    totalEarned: 0,
  });

  useEffect(() => {
    // Load agency clients and calculate commissions
    const clients = JSON.parse(localStorage.getItem("agency_clients") || "[]");

    // Calculate current month commission from active clients
    const activeClients = clients.filter(
      (client: any) => client.status === "active",
    );
    const currentMonthCommission = activeClients.reduce(
      (sum: number, client: any) => {
        return sum + client.monthlyValue * 0.15;
      },
      0,
    );

    // Generate sample commission payments history
    const samplePayments: CommissionPayment[] = [
      {
        id: "1",
        month: "March",
        year: 2024,
        totalRevenue: 1194,
        commissionRate: 15,
        commissionAmount: 179.1,
        status: "pending",
        dueDate: "2024-04-05",
        clientCount: activeClients.length,
      },
      {
        id: "2",
        month: "February",
        year: 2024,
        totalRevenue: 1045,
        commissionRate: 15,
        commissionAmount: 156.75,
        status: "paid",
        paidDate: "2024-03-05",
        dueDate: "2024-03-05",
        clientCount: 3,
      },
      {
        id: "3",
        month: "January",
        year: 2024,
        totalRevenue: 895,
        commissionRate: 15,
        commissionAmount: 134.25,
        status: "paid",
        paidDate: "2024-02-05",
        dueDate: "2024-02-05",
        clientCount: 2,
      },
    ];

    // Update current month with actual data
    if (samplePayments.length > 0) {
      samplePayments[0].totalRevenue = activeClients.reduce(
        (sum: number, client: any) => {
          return sum + client.monthlyValue;
        },
        0,
      );
      samplePayments[0].commissionAmount = currentMonthCommission;
      samplePayments[0].clientCount = activeClients.length;
    }

    setPayments(samplePayments);

    // Calculate client-specific commissions
    const clientComms: ClientCommission[] = activeClients.map(
      (client: any) => ({
        clientId: client.id,
        clientName: client.businessName,
        plan: client.plan,
        monthlyValue: client.monthlyValue,
        commissionAmount: client.monthlyValue * 0.15,
        status: client.status,
      }),
    );

    setClientCommissions(clientComms);

    // Calculate total stats
    const lastMonthCommission = samplePayments[1]?.commissionAmount || 0;
    const yearToDate = samplePayments.reduce((sum, payment) => {
      return payment.year === 2024 ? sum + payment.commissionAmount : sum;
    }, 0);
    const totalEarned = samplePayments
      .filter((p) => p.status === "paid")
      .reduce((sum, payment) => sum + payment.commissionAmount, 0);

    setTotalStats({
      currentMonth: currentMonthCommission,
      lastMonth: lastMonthCommission,
      yearToDate,
      totalEarned,
    });
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { variant: "default" as const, label: "Paid", icon: CheckCircle },
      pending: { variant: "outline" as const, label: "Pending", icon: Clock },
      processing: {
        variant: "secondary" as const,
        label: "Processing",
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

  const downloadStatement = () => {
    // In a real app, this would generate and download a PDF statement
    console.log("Downloading commission statement...");
  };

  return (
    <AgencyAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Commission Tracking</h1>
            <p className="text-muted-foreground">
              Track your earnings and commission payments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Month</SelectItem>
                <SelectItem value="last3">Last 3 Months</SelectItem>
                <SelectItem value="last6">Last 6 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={downloadStatement}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Statement
            </Button>
          </div>
        </div>

        {/* Commission Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Month
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalStats.currentMonth.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                15% commission rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalStats.lastMonth.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalStats.currentMonth > totalStats.lastMonth ? "+" : ""}
                {(
                  ((totalStats.currentMonth - totalStats.lastMonth) /
                    Math.max(totalStats.lastMonth, 1)) *
                  100
                ).toFixed(1)}
                % vs last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Year to Date
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalStats.yearToDate.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                2024 total earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earned
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalStats.totalEarned.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                All-time commission payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Commission Payments History */}
        <Card>
          <CardHeader>
            <CardTitle>Commission Payments</CardTitle>
            <CardDescription>
              Monthly commission payment history and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Client Revenue</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead>Commission Amount</TableHead>
                    <TableHead>Clients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.month} {payment.year}
                      </TableCell>
                      <TableCell>${payment.totalRevenue.toFixed(0)}</TableCell>
                      <TableCell>{payment.commissionRate}%</TableCell>
                      <TableCell className="font-medium">
                        ${payment.commissionAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {payment.clientCount}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(payment.dueDate).toLocaleDateString()}
                        </div>
                        {payment.paidDate && (
                          <div className="text-xs text-muted-foreground">
                            Paid:{" "}
                            {new Date(payment.paidDate).toLocaleDateString()}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Client Commission Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Client Commission Breakdown</CardTitle>
            <CardDescription>
              Commission earned from each active client this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Monthly Value</TableHead>
                    <TableHead>Your Commission</TableHead>
                    <TableHead>Annual Commission</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientCommissions.map((client) => (
                    <TableRow key={client.clientId}>
                      <TableCell className="font-medium">
                        {client.clientName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{client.plan}</Badge>
                      </TableCell>
                      <TableCell>${client.monthlyValue}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        ${client.commissionAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-green-600">
                        ${(client.commissionAmount * 12).toFixed(0)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            client.status === "active" ? "default" : "secondary"
                          }
                        >
                          {client.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {clientCommissions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active clients generating commission</p>
                <p className="text-sm">
                  Add clients to start earning commission
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>
              How and when you receive commission payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Payment Schedule</h4>
                <p className="text-sm text-muted-foreground">
                  Commission payments are processed monthly on the 5th of each
                  month for the previous month's earnings.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Commission Rate</h4>
                <p className="text-sm text-muted-foreground">
                  You earn 15% commission on all active client subscriptions.
                  Commission is calculated on the monthly subscription value.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Payment Method</h4>
                <p className="text-sm text-muted-foreground">
                  Payments are made via bank transfer to your registered
                  account. Update your payment details in settings.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Minimum Payout</h4>
                <p className="text-sm text-muted-foreground">
                  Minimum commission payout is $50. If monthly commission is
                  below this, it will roll over to the next month.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AgencyAdminLayout>
  );
}
