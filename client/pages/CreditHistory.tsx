import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/AppLayout";
import {
  ArrowLeft,
  Search,
  Download,
  Filter,
  Zap,
  Plus,
  Minus,
  CreditCard,
  RotateCcw,
  Gift,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCredits } from "@/components/CreditProvider";
import { formatCredits, CreditTransaction } from "@/lib/creditSystem";

export default function CreditHistory() {
  const navigate = useNavigate();
  const { transactions, balance } = useCredits();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Filter transactions based on search and filters
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    // Filter by date range
    if (dateRange !== "all") {
      const now = new Date();
      let startDate = new Date();
      
      switch (dateRange) {
        case "7days":
          startDate.setDate(now.getDate() - 7);
          break;
        case "30days":
          startDate.setDate(now.getDate() - 30);
          break;
        case "90days":
          startDate.setDate(now.getDate() - 90);
          break;
      }
      
      filtered = filtered.filter(tx => new Date(tx.timestamp) >= startDate);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tx =>
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [transactions, filterType, dateRange, searchQuery]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalCreditsAdded = filteredTransactions
      .filter(tx => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalCreditsUsed = filteredTransactions
      .filter(tx => tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const scanCount = filteredTransactions.filter(tx => tx.type === 'scan').length;
    const purchaseCount = filteredTransactions.filter(tx => tx.type === 'purchase').length;

    return {
      totalAdded: totalCreditsAdded,
      totalUsed: totalCreditsUsed,
      scanCount,
      purchaseCount,
    };
  }, [filteredTransactions]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <CreditCard className="h-4 w-4 text-green-600" />;
      case 'scan':
        return <Zap className="h-4 w-4 text-blue-600" />;
      case 'refund':
        return <RotateCcw className="h-4 w-4 text-yellow-600" />;
      case 'bonus':
        return <Gift className="h-4 w-4 text-purple-600" />;
      default:
        return <Zap className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportHistory = () => {
    const csv = [
      ['Date', 'Type', 'Description', 'Credits', 'Transaction ID'].join(','),
      ...filteredTransactions.map(tx => [
        new Date(tx.timestamp).toISOString(),
        tx.type,
        `"${tx.description}"`,
        tx.amount,
        tx.id
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit History</h1>
              <p className="text-gray-600">
                Track your credit purchases and usage over time
              </p>
            </div>
            
            <Button onClick={exportHistory} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Balance</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCredits(balance.remaining)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Credits Added</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{formatCredits(summaryStats.totalAdded)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Credits Used</p>
                  <p className="text-2xl font-bold text-red-600">
                    -{formatCredits(summaryStats.totalUsed)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Scans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {summaryStats.scanCount}
                  </p>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="purchase">Purchases</SelectItem>
                  <SelectItem value="scan">Scans</SelectItem>
                  <SelectItem value="refund">Refunds</SelectItem>
                  <SelectItem value="bonus">Bonuses</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transaction History</CardTitle>
              <Badge variant="outline">
                {filteredTransactions.length} transactions
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || filterType !== "all" || dateRange !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "Your credit transactions will appear here once you start using the service."}
                </p>
                {(!searchQuery && filterType === "all" && dateRange === "all") && (
                  <Button onClick={() => navigate('/admin/credits/purchase')}>
                    Purchase Credits
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 capitalize">
                            {transaction.type}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {transaction.id}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{formatDate(transaction.timestamp)}</span>
                          {transaction.scanType && (
                            <span>Type: {transaction.scanType}</span>
                          )}
                          {transaction.waypointCount && (
                            <span>Waypoints: {transaction.waypointCount}</span>
                          )}
                          {transaction.keywordCount && (
                            <span>Keywords: {transaction.keywordCount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getTransactionColor(transaction.amount)}`}>
                        {transaction.amount > 0 ? '+' : ''}
                        {formatCredits(transaction.amount)}
                      </div>
                      <div className="text-xs text-gray-500">credits</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
